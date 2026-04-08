from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
from random import Random
from typing import Any

import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

from .domain import CompanySnapshot
from .scoring import (
    FEATURE_NAMES,
    build_feature_vector,
    clamp,
    compute_breakdown_from_features,
    vectorize_features,
)


FEATURE_BOUNDS = {
    "revenue_millions": (50.0, 100_000.0),
    "net_margin_pct": (-40.0, 60.0),
    "return_on_equity_pct": (-40.0, 45.0),
    "ebitda_margin_pct": (-30.0, 65.0),
    "fcf_margin_pct": (-30.0, 50.0),
    "cash_conversion_ratio": (0.0, 3.0),
    "debt_to_ebitda": (0.0, 8.0),
    "debt_to_fcf": (0.0, 10.0),
    "debt_to_equity": (0.0, 5.0),
    "pe_ratio": (1.0, 60.0),
    "earnings_yield_pct": (0.0, 25.0),
    "governance_score": (0.0, 100.0),
    "social_score": (0.0, 100.0),
    "environmental_score": (0.0, 100.0),
    "sector_durability_score": (0.0, 100.0),
}

MULTIPLICATIVE_JITTER_FEATURES = {
    "revenue_millions",
    "cash_conversion_ratio",
    "debt_to_ebitda",
    "debt_to_fcf",
    "debt_to_equity",
    "pe_ratio",
    "earnings_yield_pct",
}

JITTER_STRENGTH = {
    "revenue_millions": 0.18,
    "net_margin_pct": 3.0,
    "return_on_equity_pct": 3.0,
    "ebitda_margin_pct": 3.5,
    "fcf_margin_pct": 3.0,
    "cash_conversion_ratio": 0.18,
    "debt_to_ebitda": 0.20,
    "debt_to_fcf": 0.20,
    "debt_to_equity": 0.20,
    "pe_ratio": 0.16,
    "earnings_yield_pct": 0.18,
    "governance_score": 4.0,
    "social_score": 4.0,
    "environmental_score": 4.0,
    "sector_durability_score": 0.0,
}


@dataclass(frozen=True, slots=True)
class CompanyLabel:
    slug: str
    buffett_score: float
    component_scores: dict[str, float]
    analyst_notes: tuple[str, ...]


@dataclass(frozen=True, slots=True)
class TrainingExample:
    identifier: str
    company_name: str
    sector: str
    features: dict[str, float]
    target_score: float
    heuristic_score: float
    label_source: str
    notes: tuple[str, ...]


@dataclass(slots=True)
class TrainedModelArtifact:
    model: RandomForestRegressor
    feature_names: tuple[str, ...]
    trained_at: str
    company_count: int
    dataset_rows: int
    synthetic_rows: int
    label_sources: dict[str, int]
    metrics: dict[str, float]


def load_company_labels(labels_path: Path) -> dict[str, CompanyLabel]:
    with labels_path.open(encoding="utf-8") as file_handle:
        payload = json.load(file_handle)

    labels: dict[str, CompanyLabel] = {}

    for item in payload.get("labels", []):
        labels[item["slug"]] = CompanyLabel(
            slug=item["slug"],
            buffett_score=float(item["buffett_score"]),
            component_scores={
                key: float(value)
                for key, value in item.get("component_scores", {}).items()
            },
            analyst_notes=tuple(item.get("analyst_notes", [])),
        )

    return labels


def build_training_examples(
    companies: list[CompanySnapshot],
    manual_labels: dict[str, CompanyLabel],
) -> list[TrainingExample]:
    examples: list[TrainingExample] = []

    for company in companies:
        features = build_feature_vector(company)
        heuristic_breakdown = compute_breakdown_from_features(features)
        manual_label = manual_labels.get(company.identifier)

        if manual_label:
            target_score = manual_label.buffett_score
            label_source = "manual"
            notes = manual_label.analyst_notes
        else:
            target_score = heuristic_breakdown.overall_score
            label_source = "heuristic"
            notes = heuristic_breakdown.rationale

        examples.append(
            TrainingExample(
                identifier=company.identifier,
                company_name=company.name,
                sector=company.sector,
                features=features,
                target_score=round(target_score, 2),
                heuristic_score=heuristic_breakdown.overall_score,
                label_source=label_source,
                notes=notes,
            )
        )

    return examples


def _jitter_feature(name: str, value: float, randomizer: Random) -> float:
    lower_bound, upper_bound = FEATURE_BOUNDS[name]
    strength = JITTER_STRENGTH[name]

    if strength == 0.0:
        return value

    if name in MULTIPLICATIVE_JITTER_FEATURES:
        candidate = value * (1 + randomizer.uniform(-strength, strength))
    else:
        candidate = value + randomizer.uniform(-strength, strength)

    return max(lower_bound, min(upper_bound, candidate))


def build_augmented_training_rows(
    examples: list[TrainingExample],
    synthetic_copies_per_company: int,
    random_state: int,
) -> tuple[list[list[float]], list[float], int]:
    if not examples:
        raise ValueError("Aucune entreprise disponible pour entrainer le modele.")

    randomizer = Random(random_state)
    matrix: list[list[float]] = []
    labels: list[float] = []
    synthetic_rows = 0

    for example in examples:
        matrix.append(vectorize_features(example.features))
        labels.append(example.target_score)

        base_breakdown = compute_breakdown_from_features(example.features)

        for _ in range(synthetic_copies_per_company):
            synthetic_features = {
                feature_name: _jitter_feature(feature_name, feature_value, randomizer)
                for feature_name, feature_value in example.features.items()
            }
            synthetic_breakdown = compute_breakdown_from_features(synthetic_features)
            heuristic_delta = (
                synthetic_breakdown.overall_score - base_breakdown.overall_score
            )
            synthetic_target = clamp(
                example.target_score
                + (0.90 * heuristic_delta)
                + randomizer.uniform(-1.2, 1.2)
            )

            matrix.append(vectorize_features(synthetic_features))
            labels.append(round(synthetic_target, 2))
            synthetic_rows += 1

    return matrix, labels, synthetic_rows


def train_random_forest(
    examples: list[TrainingExample],
    synthetic_copies_per_company: int,
    random_state: int,
) -> TrainedModelArtifact:
    matrix, labels, synthetic_rows = build_augmented_training_rows(
        examples,
        synthetic_copies_per_company=synthetic_copies_per_company,
        random_state=random_state,
    )

    x_train, x_test, y_train, y_test = train_test_split(
        matrix,
        labels,
        test_size=0.20,
        random_state=random_state,
    )

    evaluation_model = RandomForestRegressor(
        n_estimators=320,
        max_depth=8,
        min_samples_leaf=2,
        random_state=random_state,
    )
    evaluation_model.fit(x_train, y_train)
    holdout_predictions = evaluation_model.predict(x_test)
    holdout_mae = mean_absolute_error(y_test, holdout_predictions)

    final_model = RandomForestRegressor(
        n_estimators=320,
        max_depth=8,
        min_samples_leaf=2,
        random_state=random_state,
    )
    final_model.fit(matrix, labels)

    label_sources: dict[str, int] = {}
    for example in examples:
        label_sources[example.label_source] = label_sources.get(example.label_source, 0) + 1

    return TrainedModelArtifact(
        model=final_model,
        feature_names=FEATURE_NAMES,
        trained_at=datetime.now(timezone.utc).isoformat(),
        company_count=len(examples),
        dataset_rows=len(matrix),
        synthetic_rows=synthetic_rows,
        label_sources=label_sources,
        metrics={
            "holdout_mae": round(float(holdout_mae), 4),
            "holdout_samples": float(len(y_test)),
        },
    )


def save_artifact(
    artifact: TrainedModelArtifact,
    model_path: Path,
    metadata_path: Path,
) -> None:
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": artifact.model,
            "feature_names": list(artifact.feature_names),
        },
        model_path,
    )

    metadata_path.write_text(
        json.dumps(
            {
                "trained_at": artifact.trained_at,
                "company_count": artifact.company_count,
                "dataset_rows": artifact.dataset_rows,
                "synthetic_rows": artifact.synthetic_rows,
                "label_sources": artifact.label_sources,
                "metrics": artifact.metrics,
            },
            indent=2,
        ),
        encoding="utf-8",
    )


def load_artifact(model_path: Path, metadata_path: Path) -> TrainedModelArtifact:
    payload: dict[str, Any] = joblib.load(model_path)
    metadata = json.loads(metadata_path.read_text(encoding="utf-8"))

    return TrainedModelArtifact(
        model=payload["model"],
        feature_names=tuple(payload["feature_names"]),
        trained_at=metadata["trained_at"],
        company_count=int(metadata["company_count"]),
        dataset_rows=int(metadata["dataset_rows"]),
        synthetic_rows=int(metadata["synthetic_rows"]),
        label_sources={
            key: int(value) for key, value in metadata.get("label_sources", {}).items()
        },
        metrics={
            key: float(value) for key, value in metadata.get("metrics", {}).items()
        },
    )
