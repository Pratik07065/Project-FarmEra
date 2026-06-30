import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
PROJECT_BACKEND_DIR = BASE_DIR.parent


def _resolve_path_from_env(env_key: str, default_candidates: list[Path]) -> Path:
    env_value = os.environ.get(env_key)
    if env_value:
        return Path(env_value).expanduser().resolve()

    for candidate in default_candidates:
        if candidate.exists():
            return candidate

    return default_candidates[0]


MODEL_PATH = _resolve_path_from_env(
    "DISEASE_MODEL_PATH",
    [
        # Default: CNN trained in ml models/CNN.ipynb (128×128, rescale 1/255)
        PROJECT_BACKEND_DIR / "model" / "plant_disease_cnn_model.h5",
        BASE_DIR / "plant_disease_cnn_model.h5",
        BASE_DIR / "plant_disease_model.h5",
        BASE_DIR / "plant_disease_model_mobilenet.h5",
        PROJECT_BACKEND_DIR / "model" / "plant_disease_model_mobilenet.h5",
        PROJECT_BACKEND_DIR / "model" / "plant_disease_model.h5",
    ],
)

LABELS_PATH = _resolve_path_from_env(
    "DISEASE_LABELS_PATH",
    [
        BASE_DIR / "class_labels.json",
        PROJECT_BACKEND_DIR / "model" / "class_labels.json",
    ],
)


def _parse_img_size_env() -> tuple[int, int] | None:
    raw = os.environ.get("DISEASE_IMG_SIZE", "").strip()
    if not raw:
        return None
    parts = [p.strip() for p in raw.replace("x", ",").split(",") if p.strip()]
    if len(parts) != 2:
        raise ValueError(
            "DISEASE_IMG_SIZE must look like '128,128' or '128x128' "
            f"(got {raw!r})"
        )
    return (int(parts[0]), int(parts[1]))


def _default_img_size(model_path: Path) -> tuple[int, int]:
    name = model_path.name.lower()
    if "cnn" in name:
        return (128, 128)
    return (224, 224)


def _default_preprocess_mode(model_path: Path) -> str:
    if "mobilenet" in model_path.name.lower():
        return "mobilenet"
    return "rescale255"


_parsed_size = _parse_img_size_env()
IMG_SIZE: tuple[int, int] = (
    _parsed_size if _parsed_size is not None else _default_img_size(MODEL_PATH)
)

_preprocess_override = os.environ.get("DISEASE_PREPROCESS_MODE", "").strip().lower()
if _preprocess_override in ("mobilenet", "rescale255"):
    DISEASE_PREPROCESS_MODE = _preprocess_override
else:
    DISEASE_PREPROCESS_MODE = _default_preprocess_mode(MODEL_PATH)
