"""Preprocessing that matches how each disease model was trained."""

from __future__ import annotations

import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess


def preprocess_disease_image(
    image: Image.Image,
    img_size: tuple[int, int],
    mode: str,
) -> np.ndarray:
    image = image.convert("RGB")
    image = image.resize(img_size)
    arr = np.array(image, dtype=np.float32)
    if mode == "mobilenet":
        arr = mobilenet_preprocess(arr)
    elif mode == "rescale255":
        arr = arr / 255.0
    else:
        raise ValueError(f"Unknown DISEASE_PREPROCESS_MODE: {mode!r}")
    return np.expand_dims(arr, axis=0)
