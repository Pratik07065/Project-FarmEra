from flask import Blueprint, current_app, jsonify, request
from PIL import Image


prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.route("/disease/predict", methods=["POST"])
def predict():
    try:
        prediction_service = current_app.config.get("prediction_service")
        if not prediction_service:
            return jsonify({"error": "Disease model not loaded on server."}), 500

        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        img = Image.open(file.stream)
        result = prediction_service.predict(img)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500
