"""TensorFlow/Keras startup noise reduction.

Import `bootstrap_tf_runtime()` before any `tensorflow` / `keras` import.
After TensorFlow has been imported, call `silence_tensorflow_logging()`.
"""

from __future__ import annotations

import logging
import os


def bootstrap_tf_runtime() -> None:
    """C++ TF logs + oneDNN banner (needs to run before importing TensorFlow)."""
    # 0 = all, 1 = no INFO, 2 = no INFO/WARNING from native code
    os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
    os.environ.setdefault("TF_ENABLE_ONEDNN_OPTS", "0")


def silence_tensorflow_logging() -> None:
    """Quiet Python-side TF/Keras/absl chatter (inference-safe)."""
    for name in ("tensorflow", "keras", "absl"):
        logging.getLogger(name).setLevel(logging.ERROR)

    try:
        import absl.logging  # noqa: WPS433 — after TF may already be imported

        absl.logging.set_verbosity(absl.logging.ERROR)
    except Exception:
        pass
