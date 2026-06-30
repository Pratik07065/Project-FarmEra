"""
FarmEra backend entrypoint.

Important: the "real" app (all routes + models) is assembled in `application.py` via
`create_app()` using blueprints.

Run:
  python app.py

This will expose:
  - POST /disease/predict   (leaf disease image)
  - POST /predict           (market price prediction)
  - POST /predict_yield     (yield prediction)
  - /market/*, /auth/*, ...
"""

try:
    from .application import create_app
except ImportError:
    from application import create_app

app = create_app()


if __name__ == "__main__":
    import logging
    import os

    # Keep console readable (optional)
    logging.getLogger("werkzeug").setLevel(logging.ERROR)

    host = os.environ.get("BACKEND_HOST", "127.0.0.1")
    port = int(os.environ.get("BACKEND_PORT", "5000"))
    use_reloader = os.environ.get("FLASK_USE_RELOADER", "").lower() in ("1", "true", "yes")

    print(f"\nFarmEra backend -> http://{host}:{port}/\n")
    app.run(debug=True, use_reloader=use_reloader, host=host, port=port)









    