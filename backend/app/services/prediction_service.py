import json
import os
from typing import Dict, Any

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

try:
    from ..core.config import DISEASE_PREPROCESS_MODE, IMG_SIZE, LABELS_PATH, MODEL_PATH
    from ..core.disease_preprocess import preprocess_disease_image
except ImportError:
    from core.config import DISEASE_PREPROCESS_MODE, IMG_SIZE, LABELS_PATH, MODEL_PATH
    from core.disease_preprocess import preprocess_disease_image


class PredictionService:
    def __init__(self) -> None:
        self.model = load_model(str(MODEL_PATH))

        # Load standard class labels
        with open(LABELS_PATH, encoding="utf-8") as labels_file:
            class_labels = json.load(labels_file)

        self.index_to_label: Dict[int, str] = {v: k for k, v in class_labels.items()}
        
        # Load Rich Disease Solutions from our new JSON file
        info_path = os.path.join(os.path.dirname(__file__), "disease_info.json")
        try:
            with open(info_path, encoding="utf-8") as info_file:
                self.disease_info = json.load(info_file)
        except FileNotFoundError:
            print("Warning: disease_info.json not found. Using fallbacks.")
            self.disease_info = {}

    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        return preprocess_disease_image(image, IMG_SIZE, DISEASE_PREPROCESS_MODE)

    def predict(self, image: Image.Image) -> Dict[str, Any]:
        processed = self.preprocess_image(image)
        prediction = self.model.predict(processed, verbose=0)

        class_index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        disease = self.index_to_label.get(class_index, "Unknown")
        
        # Look up the disease in our JSON. If not found, provide a safe fallback structure.
        fallback_info = {
            "name": disease,
            "crop": "Unknown",
            "symptoms": ["Symptoms not listed in database."],
            "treatment": ["Consult an agricultural expert."],
            "prevention": ["Maintain standard plant care."]
        }
        
        rich_solution = self.disease_info.get(disease, fallback_info)

        return {
            "disease": disease,
            "confidence": round(confidence * 100, 2),
            "rich_info": rich_solution, # Sending the whole structured object
        }