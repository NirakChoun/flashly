import os
import secrets
from urllib.parse import urlencode
from flask import current_app, request, redirect, session, abort, jsonify
from flask_jwt_extended import create_access_token, set_access_cookies
import requests
from app.models import User
from app import db

def get_unique_username(base_username):
    """Generate unique username by appending numbers if needed"""
    username = base_username.lower().replace(' ', '_').replace('@', '_')
    username = ''.join(c for c in username if c.isalnum() or c == '_')
    
    if not username or len(username) < 3:
        username = "user"
    
    original = username
    counter = 1
    
    while User.query.filter_by(username=username).first():
        username = f"{original}_{counter}"
        counter += 1
    
    return username

def oauth2_authorize(provider):
    """Initiate OAuth2 authorization"""
    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        abort(404)

    # Generate a random string for the state parameter
    session['oauth2_state'] = secrets.token_urlsafe(16)

    # Create query string with OAuth2 parameters
    qs = urlencode({
        'client_id': provider_data['client_id'],
        'redirect_uri': f"{request.host_url.rstrip('/')}/oauth/callback/{provider}",
        'response_type': 'code',
        'scope': ' '.join(provider_data['scopes']),
        'state': session['oauth2_state'],
    })

    # Redirect to OAuth2 provider
    return redirect(provider_data['authorize_url'] + '?' + qs)

def oauth2_callback(provider):
    """Handle OAuth2 callback"""
    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        abort(404)

    # Check for authentication errors
    if 'error' in request.args:
        error_msg = request.args.get('error_description', request.args.get('error'))
        return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error={error_msg}")

    # Verify state parameter
    if request.args.get('state') != session.get('oauth2_state'):
        return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=invalid_state")

    # Check for authorization code
    if 'code' not in request.args:
        return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=no_code")

    try:
        # Exchange authorization code for access token
        response = requests.post(provider_data['token_url'], data={
            'client_id': provider_data['client_id'],
            'client_secret': provider_data['client_secret'],
            'code': request.args['code'],
            'grant_type': 'authorization_code',
            'redirect_uri': f"{request.host_url.rstrip('/')}/oauth/callback/{provider}",
        }, headers={'Accept': 'application/json'})

        if response.status_code != 200:
            return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=token_exchange_failed")

        oauth2_token = response.json().get('access_token')
        if not oauth2_token:
            return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=no_access_token")

        # Get user info from provider
        user_info = get_user_info(provider, provider_data, oauth2_token)
        if not user_info:
            return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=user_info_failed")

        # Find or create user
        user = find_or_create_user(provider, user_info)
        if not user:
            return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=user_creation_failed")

        # Create JWT and redirect to frontend
        access_token = create_access_token(identity=str(user.id))
        response = redirect(f"{os.getenv('FRONTEND_URL')}/home")
        set_access_cookies(response, access_token)
        
        # Clear OAuth state from session
        session.pop('oauth2_state', None)
        
        return response

    except Exception as e:
        current_app.logger.error(f"OAuth {provider} error: {str(e)}")
        return redirect(f"{os.getenv('FRONTEND_URL')}/auth/login?error=oauth_error")

def get_user_info(provider, provider_data, access_token):
    """Get user information from OAuth provider"""
    try:
        # Get user info
        response = requests.get(provider_data['userinfo']['url'], headers={
            'Authorization': 'Bearer ' + access_token,
            'Accept': 'application/json',
        })

        if response.status_code != 200:
            return None

        user_data = response.json()

        # For GitHub, we need to get email separately
        email = None
        if provider == 'github':
            if 'email_url' in provider_data['userinfo']:
                email_response = requests.get(provider_data['userinfo']['email_url'], headers={
                    'Authorization': 'Bearer ' + access_token,
                    'Accept': 'application/json',
                })
                if email_response.status_code == 200:
                    emails = email_response.json()
                    # Find primary verified email
                    for email_info in emails:
                        if email_info.get('primary') and email_info.get('verified'):
                            email = email_info['email']
                            break
                    if not email and emails:
                        email = emails[0]['email']
            else:
                email = user_data.get('email')
        else:
            email = provider_data['userinfo']['email'](user_data)

        if not email:
            return None

        return {
            'email': email,
            'name': provider_data['userinfo']['name'](user_data),
            'picture': provider_data['userinfo']['picture'](user_data),
            'provider_id': str(user_data.get('id', ''))
        }

    except Exception as e:
        current_app.logger.error(f"Error getting {provider} user info: {str(e)}")
        return None

def find_or_create_user(provider, user_info):
    """Find existing user or create new one"""
    try:
        email = user_info['email']
        
        # Check if user already exists by email
        user = User.query.filter_by(email=email).first()
        
        if user:
            # Update OAuth info for existing user
            if not user.oauth_provider:
                user.oauth_provider = provider
                user.oauth_id = user_info['provider_id']
            
            # Update avatar if not set
            if not user.avatar_url and user_info.get('picture'):
                user.avatar_url = user_info['picture']
                
            db.session.commit()
            return user

        # Create new user
        username = get_unique_username(user_info['name'] or email.split('@')[0])
        
        user = User(
            username=username,
            email=email,
            oauth_provider=provider,
            oauth_id=user_info['provider_id'],
            avatar_url=user_info.get('picture')
        )
        
        db.session.add(user)
        db.session.commit()
        return user

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating user: {str(e)}")
        return None