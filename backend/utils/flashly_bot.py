import google.generativeai as genai
import os
from dotenv import load_dotenv
import pymupdf
import re
import json

load_dotenv()

class FlashlyBot:
    def __init__(self):
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=GEMINI_API_KEY)
        
        generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 8192,
        }
        
        self.model = genai.GenerativeModel(
            'gemini-1.5-flash',
            generation_config=generation_config
        )
    
    def extract_text(self, file):
        try:
            file_stream = file.stream 
            doc = pymupdf.open(stream=file_stream.read(), filetype="pdf")
            text = ""
            page_count = 0
            
            for page in doc:
                text += page.get_text()
                page_count += 1
                
            print(f"📝 Extracted {len(text)} characters from {page_count} pages")  # ✅ ADD: Helpful logging
            doc.close()
            return text
        except Exception as e:
            print(f"❌ Error extracting text: {e}")
            return ""
    
    def clean_gemini_output(self, raw_text):
        # Print the raw response for debugging
        print(f"Raw response first 100 chars: {raw_text[:100]}")
        
        # Remove unwanted characters like code fences, backticks, extra spaces
        cleaned_text = raw_text.strip()
        cleaned_text = cleaned_text.replace('```json', '').replace('```', '').strip()
        
        # Check if the text already has escaped quotes
        if '\\\"' in cleaned_text or '\\\"question' in cleaned_text:
            # If quotes are already escaped, we need to unescape them for json.loads
            cleaned_text = cleaned_text.replace('\\"', '"')
        
        # Try to extract a valid JSON array using regex
        json_pattern = r'\[\s*\{.*\}\s*\]'
        json_match = re.search(json_pattern, cleaned_text, re.DOTALL)
        if json_match:
            cleaned_text = json_match.group(0)
        
        # Manual character replacement for common issues
        cleaned_text = cleaned_text.replace(' g', 'ng')
        cleaned_text = cleaned_text.replace(' i ', ' in ')
        cleaned_text = cleaned_text.replace(' itor', 'nitor')
        
        # Fix common JSON structure issues
        cleaned_text = re.sub(r'\}\s*\{', '},{', cleaned_text)
        
        # Ensure the text is surrounded by square brackets for an array
        if not cleaned_text.startswith('['):
            cleaned_text = '[' + cleaned_text
        if not cleaned_text.endswith(']'):
            cleaned_text = cleaned_text + ']'
        
        # Extract and reconstruct the JSON manually
        try:
            # Try direct parsing first
            flashcards = json.loads(cleaned_text)
            return flashcards
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing JSON: {e}")
            print(cleaned_text[:100] + "..." if len(cleaned_text) > 100 else cleaned_text)
            
            # Try a completely different approach: manually extract JSON objects
            try:
                # Extract all pairs of "question": "text", "answer": "text"
                question_pattern = r'"question"\s*:\s*"([^"]*)"'
                answer_pattern = r'"answer"\s*:\s*"([^"]*)"'
                
                questions = re.findall(question_pattern, cleaned_text)
                answers = re.findall(answer_pattern, cleaned_text)
                
                if questions and answers and len(questions) == len(answers):
                    result = []
                    for i in range(len(questions)):
                        result.append({"question": questions[i], "answer": answers[i]})
                    return result
            except Exception as e2:
                print(f"Pattern extraction failed: {e2}")
            
            # Final attempt: try to fix the JSON with a more aggressive approach
            try:
                # Remove all whitespace and then add minimal formatting back
                no_space = cleaned_text.replace(" ", "").replace("\n", "")
                fixed = no_space.replace('},{', '}, {')
                return json.loads(fixed)
            except Exception as e3:
                print(f"Final attempt failed: {e3}")
                
            return None
    
    def generate_flashcards(self, text):
        prompt = f"""
            You are an AI trained to create flashcards for studying.
            Given the input text, generate flashcards in the following strict JSON format:
            [
            {{
                "question": "full question text here INCLUDING ALL MULTIPLE CHOICE OPTIONS if present",
                "answer": "only the correct answer text here"
            }}
            ]
            
            CRITICAL FORMATTING RULES:
            - Return ONLY valid, unescaped JSON with NO extra characters
            - No markdown formatting, no backticks (```) 
            - Do not escape quotes in the JSON structure itself - only escape quotes that appear within strings
            - Double quotes must be used for property names and string values (not single quotes)
            - Absolutely no explanation text or comments before or after the JSON
            - Format all flashcards as part of a single JSON array
            - DO NOT include literal 'n' characters to represent newlines - use spaces instead
            
            CONTENT RULES:
            - ALWAYS include the complete question text exactly as provided
            - For multiple choice questions, include ALL options (a, b, c, d, etc.) in the question field
            - Format multiple choice options like: "Which of the following is an input device? (a) CPU (b) Monitor (c) Mouse (d) Printer"
            - Format code examples with proper spacing, not with newlines
            - If the original question already has numbered or lettered choices, preserve them but format them inline with spaces
            
            Now, based on this material, generate flashcards:
            ---
            {text}
            ---
        """
        
        try:
            response = self.model.generate_content(prompt)
            flashcards = self.clean_gemini_output(response.text)
            if flashcards:
                print(f"✅ Generated {len(flashcards)} unlimited flashcards!")
            return flashcards
        except Exception as e:
            print(f"❌ Error generating flashcards: {e}")
            return None