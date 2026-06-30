import pandas as pd
from flask import Blueprint, current_app, jsonify, request


ml_bp = Blueprint("ml", __name__)


@ml_bp.route("/predict_yield", methods=["POST"])
def predict_yield():
    yield_model = current_app.config.get("yield_model")
    if not yield_model:
        return jsonify({"success": False, "error": "Model not loaded on server."}), 500

    try:
        data = request.json
        df = pd.DataFrame([data])

        if "date_of_sowing" in df.columns:
            df = df.drop(columns=["date_of_sowing"])

        numeric_cols = ["Nitrogen", "Phosphorus", "Potassium", "crop_duration"]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col])

        prediction = yield_model.predict(df)
        return jsonify({"success": True, "predicted_yield": round(float(prediction[0]), 2)})

    except Exception as exc:
        print(f"Prediction error: {str(exc)}")
        return jsonify({"success": False, "error": "Failed to process prediction."}), 400


@ml_bp.route("/predict", methods=["POST"])
def predict_price():
    price_model = current_app.config.get("price_model")
    if not price_model:
        return jsonify({"error": "Model not loaded on server.", "status": "failed"}), 500

    try:
        json_data = request.get_json()
        if not json_data:
            return jsonify({"error": "No input data provided"}), 400

        df = pd.DataFrame([json_data])
        df["Arrival_Date"] = pd.to_datetime(df["Arrival_Date"], format="%d-%m-%Y")

        df["Day"] = df["Arrival_Date"].dt.day
        df["Month"] = df["Arrival_Date"].dt.month
        df["Year"] = df["Arrival_Date"].dt.year
        df.drop(columns=["Arrival_Date"], inplace=True)

        prediction = price_model.predict(df)

        return jsonify(
            {
                "min_price": round(float(prediction[0][0]), 2),
                "max_price": round(float(prediction[0][1]), 2),
                "modal_price": round(float(prediction[0][2]), 2),
                "status": "success",
            }
        )

    except Exception as exc:
        print(f"Prediction Error: {exc}")
        return jsonify({"error": str(exc), "status": "failed"}), 500
