import joblib

try:
    from ..core.settings import PRICE_MODEL_PATH, YIELD_MODEL_PATH
except ImportError:
    from core.settings import PRICE_MODEL_PATH, YIELD_MODEL_PATH


def load_yield_model():
    try:
        model = joblib.load(YIELD_MODEL_PATH)
        print("Loaded onion_yield.pkl successfully.")
        return model
    except Exception as exc:
        print(f"Warning: Could not load onion_yield.pkl: {exc}")
        return None


def load_price_model():
    try:
        model = joblib.load(PRICE_MODEL_PATH)
        print("Loaded onion_pipeline.pkl successfully.")
        return model
    except Exception as exc:
        print(f"Warning: Could not load onion_pipeline.pkl: {exc}")
        return None
