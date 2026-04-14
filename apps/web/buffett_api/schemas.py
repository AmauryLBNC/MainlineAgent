from __future__ import annotations

from pydantic import BaseModel, Field


class CompanyScoreInput(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    slug: str | None = Field(default=None, max_length=120)
    sector: str = Field(..., min_length=2, max_length=80)
    country: str | None = Field(default=None, max_length=80)
    revenue: float = Field(..., gt=0)
    net_income: float = Field(...)
    debt: float = Field(default=0.0, ge=0)
    shareholders_equity: float | None = Field(default=None)
    free_cash_flow: float = Field(...)
    ebitda: float = Field(...)
    pe_ratio: float = Field(default=15.0, gt=0)
    net_margin: float | None = Field(default=None, ge=-100, le=100)
    environmental_score: float = Field(default=60.0, ge=0, le=100)
    social_score: float = Field(default=60.0, ge=0, le=100)
    governance_score: float = Field(default=60.0, ge=0, le=100)


class YahooSearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str | None = None
    sector: str | None = None
    industry: str | None = None
    quote_type: str | None = None


class YahooSearchResponse(BaseModel):
    query: str
    companies: list[YahooSearchResult]


class YahooCompanyResponse(BaseModel):
    symbol: str
    name: str
    sector: str
    industry: str | None = None
    market_price: float | None = None
    country: str | None = None
    exchange: str | None = None
    currency: str | None = None
    website: str | None = None
    city: str | None = None
    state: str | None = None
    full_time_employees: int | None = None
    ceo_name: str | None = None
    ceo_title: str | None = None
    summary: str | None = None
    revenue: float | None = None
    net_income: float | None = None
    debt: float | None = None
    shareholders_equity: float | None = None
    free_cash_flow: float | None = None
    ebitda: float | None = None
    pe_ratio: float | None = None
    net_margin: float | None = None
    environmental_score: float | None = None
    social_score: float | None = None
    governance_score: float | None = None
    source: str = "yahoo_finance"


class TrainResponse(BaseModel):
    trained_at: str
    company_count: int
    dataset_rows: int
    synthetic_rows: int
    label_sources: dict[str, int]
    metrics: dict[str, float]


class ScoreResponse(BaseModel):
    company_id: int | None
    slug: str | None
    name: str
    sector: str
    country: str | None
    score: float
    tier: str
    heuristic_score: float
    component_scores: dict[str, float]
    rationale: list[str]
    feature_vector: dict[str, float]
    manual_label_score: float | None = None
    manual_notes: list[str] = Field(default_factory=list)


class RankedCompaniesResponse(BaseModel):
    trained_at: str
    company_count: int
    companies: list[ScoreResponse]
