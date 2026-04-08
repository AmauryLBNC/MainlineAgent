from __future__ import annotations

from functools import lru_cache

from fastapi import Depends, FastAPI, HTTPException

from .domain import CompanySnapshot
from .schemas import (
    CompanyScoreInput,
    RankedCompaniesResponse,
    ScoreResponse,
    TrainResponse,
    YahooCompanyResponse,
    YahooSearchResponse,
)
from .service import BuffettScoringService
from .yahoo_finance import YahooFinanceService


@lru_cache(maxsize=1)
def get_service() -> BuffettScoringService:
    return BuffettScoringService()


def _score_input_to_snapshot(payload: CompanyScoreInput) -> CompanySnapshot:
    return CompanySnapshot(
        company_id=None,
        slug=payload.slug,
        name=payload.name,
        sector=payload.sector,
        country=payload.country,
        revenue=payload.revenue,
        net_income=payload.net_income,
        debt=payload.debt,
        shareholders_equity=payload.shareholders_equity,
        free_cash_flow=payload.free_cash_flow,
        ebitda=payload.ebitda,
        pe_ratio=payload.pe_ratio,
        net_margin=payload.net_margin,
        environmental_score=payload.environmental_score,
        social_score=payload.social_score,
        governance_score=payload.governance_score,
    )


def create_app(service: BuffettScoringService | None = None) -> FastAPI:
    app = FastAPI(
        title="Buffett Company Scoring API",
        version="1.0.0",
        summary="Classement d'entreprises a la Warren Buffett avec Random Forest.",
    )

    resolved_service = service
    yahoo_service = YahooFinanceService()

    def _resolve_service() -> BuffettScoringService:
        return resolved_service or get_service()

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/train", response_model=TrainResponse)
    def train(
        service_instance: BuffettScoringService = Depends(_resolve_service),
    ) -> dict[str, object]:
        try:
            return service_instance.train_from_repository()
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    @app.get("/companies/scores", response_model=RankedCompaniesResponse)
    def ranked_companies(
        retrain: bool = False,
        service_instance: BuffettScoringService = Depends(_resolve_service),
    ) -> dict[str, object]:
        try:
            return service_instance.list_ranked_companies(retrain=retrain)
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    @app.post("/score", response_model=ScoreResponse)
    def score_company(
        payload: CompanyScoreInput,
        retrain: bool = False,
        service_instance: BuffettScoringService = Depends(_resolve_service),
    ) -> dict[str, object]:
        try:
            return service_instance.score_manual_company(
                _score_input_to_snapshot(payload),
                retrain=retrain,
            )
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    @app.get("/search", response_model=YahooSearchResponse)
    def search_companies(query: str) -> dict[str, object]:
        try:
            return {
                "query": query,
                "companies": yahoo_service.search_companies(query),
            }
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    @app.get("/company", response_model=YahooCompanyResponse)
    def company_details(symbol: str) -> dict[str, object]:
        try:
            return yahoo_service.get_company_profile(symbol)
        except Exception as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc

    return app


app = create_app()
