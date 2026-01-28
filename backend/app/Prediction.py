from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib

app = Flask(__name__)

# Load trained models
rf_model = joblib.load("rf_modal_model.pkl")
xgb_model = joblib.load("xgb_modal_model.pkl")

@app.route("/")
def home():
    return "Hybrid Onion Modal Price Prediction API is running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Input data
    input_df = pd.DataFrame([{
        "Market": data["Market"],
        "Variety": data["Variety"],
        "Day": data["Day"],
        "Month": data["Month"],
        "Year": data["Year"],
        "Modal_lag_1": data["Modal_lag_1"],
        "Modal_lag_7": data["Modal_lag_7"],
        "Modal_lag_14": data["Modal_lag_14"]
    }])

    # Predict log-scale
    rf_pred = rf_model.predict(input_df)[0]
    xgb_pred = xgb_model.predict(input_df)[0]

    # Hybrid ensemble
    hybrid_log = 0.7 * rf_pred + 0.3 * xgb_pred
    final_price = np.expm1(hybrid_log)

    return jsonify({
        "Predicted_Modal_Price": round(float(final_price), 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
