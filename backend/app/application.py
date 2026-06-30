try:
    from .core.tf_env import bootstrap_tf_runtime, silence_tensorflow_logging
except ImportError:
    from core.tf_env import bootstrap_tf_runtime, silence_tensorflow_logging

bootstrap_tf_runtime()

from flask import Flask
from flask_cors import CORS

try:
    from .core.config import LABELS_PATH, MODEL_PATH
    from .routes.admin_routes import admin_bp
    from .routes.auth_routes import auth_bp
    from .routes.market_routes import market_bp
    from .routes.ml_routes import ml_bp
    from .routes.prediction_routes import prediction_bp
    from .services.model_service import load_price_model, load_yield_model
    from .services.prediction_service import PredictionService
except ImportError:
    from core.config import LABELS_PATH, MODEL_PATH
    from routes.admin_routes import admin_bp
    from routes.auth_routes import auth_bp
    from routes.market_routes import market_bp
    from routes.ml_routes import ml_bp
    from routes.prediction_routes import prediction_bp
    from services.model_service import load_price_model, load_yield_model
    from services.prediction_service import PredictionService

silence_tensorflow_logging()


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.config["yield_model"] = load_yield_model()
    app.config["price_model"] = load_price_model()
    if MODEL_PATH.exists() and LABELS_PATH.exists():
        app.config["prediction_service"] = PredictionService()
    else:
        app.config["prediction_service"] = None
        print(
            "Info: Disease prediction model is disabled "
            f"(missing file: {MODEL_PATH} or {LABELS_PATH})."
        )
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(ml_bp)
    app.register_blueprint(market_bp)
    app.register_blueprint(prediction_bp)

    return app
