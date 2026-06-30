import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]

MONGO_URI_AUTH = os.environ.get("MONGO_URI_AUTH", "mongodb://localhost:27017/farmera_auth")
MONGO_URI_MARKET = os.environ.get("MONGO_URI_MARKET", "mongodb://localhost:27017/farmera_market")

YIELD_MODEL_PATH = os.environ.get("YIELD_MODEL_PATH", str(BASE_DIR / "onion_yield.pkl"))
PRICE_MODEL_PATH = os.environ.get("PRICE_MODEL_PATH", str(BASE_DIR / "onion_pipeline.pkl"))

# Hidden admin accounts (admin id -> password). Not exposed in frontend UI.
ADMIN_CREDENTIALS = {
    "admin": "test123",
    "pzmeer": "pass123",
    "farmera": "be2026",
}
