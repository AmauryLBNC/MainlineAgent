from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
import os


PACKAGE_ROOT = Path(__file__).resolve().parent
DEFAULT_DATABASE_URL = (
    "postgresql://postgres:postgres@localhost:5432/mainline_agent?schema=public"
)


@dataclass(frozen=True, slots=True)
class Settings:
    database_url: str
    labels_path: Path
    artifact_dir: Path
    model_path: Path
    metadata_path: Path
    synthetic_copies_per_company: int
    random_state: int


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    artifact_dir = Path(
        os.environ.get("BUFFETT_ARTIFACT_DIR", PACKAGE_ROOT / "artifacts")
    )
    labels_path = Path(
        os.environ.get("BUFFETT_LABELS_PATH", PACKAGE_ROOT / "data/company_labels.json")
    )

    return Settings(
        database_url=os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL),
        labels_path=labels_path,
        artifact_dir=artifact_dir,
        model_path=artifact_dir / "buffett_random_forest.joblib",
        metadata_path=artifact_dir / "buffett_random_forest.metadata.json",
        synthetic_copies_per_company=int(
            os.environ.get("BUFFETT_SYNTHETIC_COPIES", "48")
        ),
        random_state=int(os.environ.get("BUFFETT_RANDOM_STATE", "42")),
    )

