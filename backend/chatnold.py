from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# GPT (Ollama) server
OLLAMA_URL = "http://localhost:11434/api/chat"

# Government agri price API
DATA_GOV_API_KEY = "579b464db66ec23bdd000001a5b2a555ad6443d364f5e4439b9ff113"
DATA_GOV_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

# Get market price from Indian agri API
def get_market_price(crop, state, district):
    params = {
        "api-key": DATA_GOV_API_KEY,
        "format": "json",
        "limit": 5,
        "filters[commodity]": crop,
        "filters[state]": state,
        "filters[district]": district
    }
    try:
        response = requests.get(DATA_GOV_URL, params=params)
        data = response.json()
        if data.get("records"):
            record = data["records"][0]
            return (
                f"📊 Market Price:\n"
                f"{record['commodity']} in {record['market']} ({record['district_name']}, {record['state']}) "
                f"is ₹{record['modal_price']} per quintal."
            )
        else:
            return "⚠️ No price data found for the given crop and location."
    except Exception as e:
        return f"❌ Error fetching price data: {str(e)}"

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "")

    # Detect price-related query (basic keyword match)
    if any(word in user_message.lower() for word in ["price", "market", "rate", "cost"]):
        # TODO: Replace with actual user input parsing logic
        crop = "Wheat"
        state = "Maharashtra"
        district = "Nashik"
        return jsonify({"reply": get_market_price(crop, state, district)})

    # For general agri questions, use GPT (Ollama)
    try:
        payload = {
            "model": "llama2",
            "messages": [{"role": "user", "content": user_message}]
        }
        gpt_response = requests.post(OLLAMA_URL, json=payload)
        reply = gpt_response.json().get("message", {}).get("content", "")
        if not reply:
            reply = "⚠️ I couldn't generate a response. Please try again."
    except Exception as e:
        reply = f"❌ GPT error: {str(e)}"

    return jsonify({"reply": reply})

# ✅ Correct main check
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)