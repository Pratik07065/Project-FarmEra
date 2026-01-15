import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow
# your React frontend to communicate with this backend
CORS(app)

# Define the Google Gemini API endpoint
# We are using gemini-2.5-flash as you requested
api_key = "AIzaSyClKw2_B9NY8EKJLksMhmM044lTUsLEhyQ"
GOOGLE_API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"

# This is the system prompt that guides the AI
# to act as an agriculture expert.
AGRICULTURE_SYSTEM_PROMPT = (
    "You are a helpful and knowledgeable assistant specializing in agriculture. "
    "Your name is 'AgriBot'. Answer the user's questions about farming, crops, "
    "soil health, pest control, irrigation, and modern agricultural technology. "
    "Provide concise, accurate, and practical advice."
)

@app.route('/api/chat', methods=['POST'])
def chat_handler():
    """
    Handles POST requests to /api/chat.
    Takes a 'prompt' from the user, sends it to the Gemini API,
    and returns the model's response.
    """
    try:
        # 1. Get the user's prompt from the request body
        data = request.json
        user_prompt = data.get('prompt')

        if not user_prompt:
            return jsonify({"error": "No prompt provided"}), 400

        # 2. Get the Google API Key from environment variables
        # This is the secure way to handle API keys.
        # DO NOT hardcode your key here.
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
            # This error will show in your backend console and in the
            # network response in your browser's developer tools.
            return jsonify({"error": "GOOGLE_API_KEY not set in environment"}), 500

        # 3. Format the API URL with your key
        api_url = GOOGLE_API_URL_TEMPLATE.format(api_key=api_key)

        # 4. Construct the payload for the Gemini API
        # We include the system prompt to give the AI context
        payload = {
            "contents": [{
                "parts": [{"text": user_prompt}]
            }],
            "systemInstruction": {
                "parts": [{"text": AGRICULTURE_SYSTEM_PROMPT}]
            },
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
            }
        }

        # 5. Make the POST request to the Google Gemini API
        response = requests.post(api_url, json=payload, headers={"Content-Type": "application/json"})

        # 6. Check for a successful response
        if response.status_code == 200:
            result = response.json()
            # Extract the generated text from the response
            # We add error handling in case the expected path doesn't exist
            try:
                text = result['candidates'][0]['content']['parts'][0]['text']
                # Send the response back to the React frontend
                return jsonify({"response": text})
            except (KeyError, IndexError, TypeError) as e:
                print(f"Error parsing Gemini response: {e}")
                print(f"Full response: {result}")
                return jsonify({"error": "Error parsing AI response"}), 500
        else:
            # If Google API returned an error
            print(f"Google API Error: {response.text}")
            return jsonify({"error": f"Google API error: {response.status_code}", "details": response.text}), response.status_code

    except Exception as e:
        # General error handling
        print(f"Server Error: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

# This allows you to run the app directly using "python app.py"
if __name__ == '__main__':
    # Runs the Flask server on http://127.0.0.1:5000
    # The debug=True setting provides helpful error messages
    # and reloads the server automatically when you save changes.
    app.run(debug=True, port=5000)