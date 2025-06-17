# 🎯 Flashly Frontend

**React-based Frontend for AI-Powered Flashcard Learning Platform**

Modern, responsive web application built with React and Tailwind CSS for creating, managing, and studying with AI-generated flashcards.

## ✨ Features

- 🎨 **Modern Dark UI** - Sleek dark theme with cyan-purple gradient accents
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🔐 **Authentication** - Secure JWT-based auth with OAuth support
- 🤖 **AI Integration** - Upload documents and generate flashcards with AI
- ⚡ **Fast Performance** - Built with Vite for optimal development and build speed
- 🎭 **Smooth Animations** - Framer Motion powered transitions and interactions
- 🧩 **Component Library** - Radix UI components for accessibility
- 🔔 **Toast Notifications** - Real-time user feedback system

## 🛠️ Tech Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **Vite 6** - Fast build tool and development server
- **React Router DOM 7** - Client-side routing and navigation

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI component primitives
  - Avatar, Dropdown Menu, Label, Slot components
- **Framer Motion 12** - Animation and gesture library
- **Lucide React** - Modern icon library
- **Class Variance Authority** - Type-safe component variants

### State & Data

- **React Hooks** - Modern state management
- **Fetch API** - HTTP client for backend communication
- **React Toastify** - Toast notification system

### Development Tools

- **ESLint** - Code linting and formatting
- **tw-animate-css** - Extended Tailwind animations
- **clsx & tailwind-merge** - Conditional class utilities

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg                 # App favicon
├── src/
│   ├── assets/
│   │   └── img/
│   │       └── logo.svg         # App logo
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Radix UI components
│   │   │   ├── avatar.jsx
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   └── ...
│   │   ├── CTA.jsx              # Call-to-action section
│   │   ├── FAQ.jsx              # Frequently asked questions
│   │   ├── Features.jsx         # Features showcase
│   │   ├── Footer.jsx           # Site footer
│   │   ├── Hero.jsx             # Landing page hero
│   │   ├── HowItWorks.jsx       # Process explanation
│   │   ├── LoginForm.jsx        # Login form component
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── RegisterForm.jsx     # Registration form
│   │   ├── Spinner.jsx          # Loading spinner
│   │   └── Testimonials.jsx     # User testimonials
│   ├── layouts/                 # Page layouts
│   │   ├── HomeLayout.jsx       # Authenticated user layout
│   │   └── LandingLayout.jsx    # Public pages layout
│   ├── lib/
│   │   └── utils.js             # Utility functions
│   ├── pages/                   # Page components
│   │   ├── AddFlashcardPage.jsx          # Manual flashcard creation
│   │   ├── AddStudySetPage.jsx           # Study set creation
│   │   ├── DashboardPage.jsx             # User dashboard
│   │   ├── EditFlashcardPage.jsx         # Bulk flashcard editing
│   │   ├── EditStudySetPage.jsx          # Study set editing
│   │   ├── GeneratePage.jsx              # AI generation interface
│   │   ├── LandingPage.jsx               # Public landing page
│   │   ├── LoginPage.jsx                 # Login page
│   │   ├── NotFoundPage.jsx              # 404 error page
│   │   ├── PreviewGeneratedStudySetPage.jsx # AI preview & editing
│   │   ├── RegisterPage.jsx              # Registration page
│   │   └── StudySetPage.jsx              # Study interface
│   ├── App.jsx                  # Main application component
│   ├── index.css                # Global styles & Tailwind imports
│   └── main.jsx                 # React app entry point
├── utils/
│   └── ProtectedRoutes.jsx      # Route protection HOC
├── components.json              # Shadcn/UI configuration
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── jsconfig.json                # JavaScript configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── vite.config.js               # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Backend API** running on localhost:8000

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flashly/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🎯 Key Features

### Authentication Flow

- **Landing Page** - Hero section with feature showcase
- **Registration/Login** - Forms with validation and OAuth options
- **Protected Routes** - JWT-based route protection

### Study Set Management

- **Dashboard** - Overview of all study sets with stats
- **Create/Edit** - Full CRUD operations for study sets
- **AI Generation** - Upload documents for automatic flashcard creation

### Flashcard Operations

- **Manual Creation** - Add flashcards individually
- **Bulk Editing** - Edit multiple flashcards at once
- **AI Preview** - Review and modify AI-generated content
- **Study Mode** - Interactive flashcard studying

### UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Eye-friendly dark color scheme
- **Smooth Animations** - Framer Motion transitions
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Skeleton loaders and progress indicators

## 🔧 Configuration

### Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### Tailwind Configuration

- **Custom Colors** - Cyan to purple gradient theme
- **Dark Mode** - Built-in dark theme support
- **Responsive Breakpoints** - Mobile-first design
- **Component Variants** - Shadcn/UI integration

### ESLint Configuration

- **React Hooks** - Enforced hook rules
- **React Refresh** - Development optimizations
- **Modern ES2020** - Latest JavaScript features

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- **Collapsible Navigation** - Hamburger menu with animations
- **Touch Optimized** - Proper touch targets and gestures
- **Flexible Layouts** - Grid and flexbox responsive layouts

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--cyan-500: #06b6d4
--purple-500: #a855f7
--gray-900: #111827

/* Background Colors */
--bg-primary: #111827    /* gray-900 */
--bg-card: #1f2937       /* gray-800 */
--bg-input: #374151      /* gray-700 */
```

### Typography

- **Font Family**: System fonts for optimal performance
- **Headings**: Bold weights with gradient text effects
- **Body Text**: Medium contrast for readability

### Components

- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Elevated surfaces with border accents
- **Forms**: Focused ring states and validation styles

## 🔄 API Integration

### Authentication Endpoints

```javascript
POST / api / auth / register; // User registration
POST / api / auth / login; // User login
POST / api / auth / logout; // User logout
GET / api / auth / profile; // Current user info
```

### Study Sets Endpoints

```javascript
GET    /api/studysets/           // Get all user study sets
POST   /api/studysets/           // Create new study set
GET    /api/studysets/:id        // Get specific study set
PUT    /api/studysets/:id        // Update study set
DELETE /api/studysets/:id        // Delete study set
```

### Flashcard Endpoints

```javascript
POST /api/studysets/:id/flashcards         // Create flashcards
PUT  /api/studysets/:id/flashcards         // Update flashcards
POST /api/studysets/:id/flashcards/preview // Generate AI preview
POST /api/studysets/:id/flashcards/save-preview // Save preview
```

## 🧪 Testing

### Component Testing

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test
```

### E2E Testing

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build and deploy dist/ folder
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables

```bash
# .env (if needed)
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Flashly
```

## 🔒 Security

### Authentication

- **JWT Tokens** - Stored in HTTP-only cookies
- **Route Protection** - Protected routes HOC
- **CSRF Protection** - Built-in browser protections

### Input Validation

- **Client-side Validation** - Form validation with error states
- **XSS Prevention** - React's built-in protections
- **File Upload Security** - Type and size restrictions

## 🎯 Performance

### Optimization Features

- **Code Splitting** - Route-based lazy loading
- **Asset Optimization** - Vite's built-in optimizations
- **Bundle Analysis** - Built-in bundle analyzer
- **Tree Shaking** - Unused code elimination

### Loading Strategies

- **Skeleton Loaders** - Better perceived performance
- **Progressive Enhancement** - Works without JavaScript
- **Optimistic Updates** - Immediate UI feedback

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow code style** (ESLint will help you)
4. **Add tests** for new features
5. **Commit changes** (`git commit -m 'Add amazing feature'`)
6. **Push to branch** (`git push origin feature/amazing-feature`)
7. **Open Pull Request**

### Code Style

- **ESLint** - Follow the configured rules
- **Prettier** - Use consistent formatting
- **Component Structure** - Follow established patterns
- **Naming Conventions** - Use descriptive names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives
- **Framer Motion** - For smooth animations
- **Lucide** - For the beautiful icon library

---

**Built with ❤️ for students worldwide**

_Learn smarter, not harder! 🎓✨_
