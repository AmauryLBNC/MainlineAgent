from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class CompanySnapshot:
    company_id: int | None
    slug: str | None
    name: str
    sector: str
    country: str | None
    revenue: float | None
    net_income: float | None
    debt: float | None
    shareholders_equity: float | None
    free_cash_flow: float | None
    ebitda: float | None
    pe_ratio: float | None
    net_margin: float | None
    environmental_score: float | None
    social_score: float | None
    governance_score: float | None
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def identifier(self) -> str:
        return self.slug or self.name


@dataclass(frozen=True, slots=True)
class BuffettBreakdown:
    overall_score: float
    component_scores: dict[str, float]
    tier: str
    rationale: tuple[str, ...]
