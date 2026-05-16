
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:10]}...")

if not api_key:
    print("No API Key found")
    exit(1)

genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel('gemini-3-flash-preview')
    response = model.generate_content("Hello, are you working?")
    print("Response:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
