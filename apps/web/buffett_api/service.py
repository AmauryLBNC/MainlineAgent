from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol

from .config import Settings, get_settings
from .domain import CompanySnapshot
from .repository import PostgresCompanyRepository
from .scoring import (
    build_feature_vector,
    clamp,
    compute_breakdown_from_features,
    get_score_tier,
    vectorize_features,
)
from .training import (
    TrainedModelArtifact,
    build_training_examples,
    load_artifact,
    load_company_labels,
    save_artifact,
    train_random_forest,
)


class CompanyRepository(Protocol):
    def list_company_snapshots(self) -> list[CompanySnapshot]:
        """Return financial snapshots ready to score."""


@dataclass(slots=True)
class BuffettScoringService:
    repository: CompanyRepository | None = None
    settings: Settings | None = None
    _labels: dict = field(init=False, repr=False)
    _artifact: TrainedModelArtifact | None = field(
        init=False,
        default=None,
        repr=False,
    )

    def __post_init__(self) -> None:
        self.settings = self.settings or get_settings()
        self.repository = self.repository or PostgresCompanyRepository(
            self.settings.database_url
        )
        self._labels = load_company_labels(self.settings.labels_path)

    def train_from_repository(self) -> dict[str, object]:
        companies = self.repository.list_company_snapshots()
        examples = build_training_examples(companies, self._labels)
        artifact = train_random_forest(
            examples,
            synthetic_copies_per_company=self.settings.synthetic_copies_per_company,
            random_state=self.settings.random_state,
        )
        save_artifact(
            artifact,
            model_path=self.settings.model_path,
            metadata_path=self.settings.metadata_path,
        )
        self._artifact = artifact

        return {
            "trained_at": artifact.trained_at,
            "company_count": artifact.company_count,
            "dataset_rows": artifact.dataset_rows,
            "synthetic_rows": artifact.synthetic_rows,
            "label_sources": artifact.label_sources,
            "metrics": artifact.metrics,
        }

    def ensure_model(self, retrain: bool = False) -> TrainedModelArtifact:
        if retrain:
            self.train_from_repository()

        if self._artifact is not None:
            return self._artifact

        if self.settings.model_path.exists() and self.settings.metadata_path.exists():
            self._artifact = load_artifact(
                self.settings.model_path,
                self.settings.metadata_path,
            )
            return self._artifact

        self.train_from_repository()

        if self._artifact is None:
            raise RuntimeError("Le modele Buffett n'a pas pu etre charge.")

        return self._artifact

    def _score_snapshot_with_artifact(
        self,
        snapshot: CompanySnapshot,
        artifact: TrainedModelArtifact,
    ) -> dict[str, object]:
        features = build_feature_vector(snapshot)
        heuristic_breakdown = compute_breakdown_from_features(features)
        raw_prediction = artifact.model.predict([vectorize_features(features)])[0]
        predicted_score = round(float(raw_prediction), 2)
        valuation_penalty = max(
            0.0,
            (60.0 - heuristic_breakdown.component_scores.get("valuation", 60.0)) * 0.20,
        )
        predicted_score = round(clamp(predicted_score - valuation_penalty), 2)
        manual_label = self._labels.get(snapshot.identifier)

        return {
            "company_id": snapshot.company_id,
            "slug": snapshot.slug,
            "name": snapshot.name,
            "sector": snapshot.sector,
            "country": snapshot.country,
            "score": predicted_score,
            "tier": get_score_tier(predicted_score),
            "heuristic_score": heuristic_breakdown.overall_score,
            "component_scores": heuristic_breakdown.component_scores,
            "rationale": list(heuristic_breakdown.rationale),
            "feature_vector": features,
            "manual_label_score": (
                round(manual_label.buffett_score, 2) if manual_label else None
            ),
            "manual_notes": list(manual_label.analyst_notes) if manual_label else [],
        }

    def list_ranked_companies(self, retrain: bool = False) -> dict[str, object]:
        artifact = self.ensure_model(retrain=retrain)
        companies = self.repository.list_company_snapshots()
        ranked_companies = [
            self._score_snapshot_with_artifact(company, artifact) for company in companies
        ]
        ranked_companies.sort(key=lambda company: company["score"], reverse=True)

        return {
            "trained_at": artifact.trained_at,
            "company_count": len(ranked_companies),
            "companies": ranked_companies,
        }

    def score_manual_company(
        self,
        snapshot: CompanySnapshot,
        retrain: bool = False,
    ) -> dict[str, object]:
        artifact = self.ensure_model(retrain=retrain)
        return self._score_snapshot_with_artifact(snapshot, artifact)
