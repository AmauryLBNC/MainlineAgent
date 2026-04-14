from __future__ import annotations

from fastapi.testclient import TestClient

from buffett_api.domain import CompanySnapshot
from buffett_api.main import create_app
from buffett_api.repository import StaticCompanyRepository
from buffett_api.service import BuffettScoringService


def _sample_companies() -> list[CompanySnapshot]:
    return [
        CompanySnapshot(
            company_id=1,
            slug="alpha",
            name="Alpha Capital",
            sector="finance",
            country="France",
            revenue=700_000_000,
            net_income=120_000_000,
            debt=55_000_000,
            shareholders_equity=530_000_000,
            free_cash_flow=130_000_000,
            ebitda=180_000_000,
            pe_ratio=14.0,
            net_margin=17.2,
            environmental_score=70,
            social_score=75,
            governance_score=85,
        ),
        CompanySnapshot(
            company_id=2,
            slug="beta",
            name="Beta Industry",
            sector="industry",
            country="Germany",
            revenue=880_000_000,
            net_income=70_000_000,
            debt=170_000_000,
            shareholders_equity=430_000_000,
            free_cash_flow=82_000_000,
            ebitda=150_000_000,
            pe_ratio=13.5,
            net_margin=8.0,
            environmental_score=74,
            social_score=71,
            governance_score=76,
        ),
    ]


def test_score_endpoint_returns_model_score() -> None:
    service = BuffettScoringService(repository=StaticCompanyRepository(_sample_companies()))
    service.train_from_repository()
    client = TestClient(create_app(service))

    response = client.post(
        "/score",
        json={
            "name": "Gamma Software",
            "sector": "technology",
            "country": "France",
            "revenue": 650000000,
            "net_income": 98000000,
            "debt": 60000000,
            "shareholders_equity": 410000000,
            "free_cash_flow": 110000000,
            "ebitda": 155000000,
            "pe_ratio": 17.0,
            "net_margin": 15.1,
            "environmental_score": 68,
            "social_score": 77,
            "governance_score": 83
        },
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["score"] >= 65
    assert payload["tier"] in {"correct", "solide", "excellent"}
    assert "profitability" in payload["component_scores"]


def test_ranked_companies_endpoint_sorts_descending() -> None:
    service = BuffettScoringService(repository=StaticCompanyRepository(_sample_companies()))
    service.train_from_repository()
    client = TestClient(create_app(service))

    response = client.get("/companies/scores")

    assert response.status_code == 200
    payload = response.json()

    assert payload["company_count"] == 2
    assert payload["companies"][0]["score"] >= payload["companies"][1]["score"]


def test_score_endpoint_accepts_negative_shareholders_equity() -> None:
    service = BuffettScoringService(repository=StaticCompanyRepository(_sample_companies()))
    service.train_from_repository()
    client = TestClient(create_app(service))

    response = client.post(
        "/score",
        json={
            "name": "Leveraged Turnaround",
            "sector": "industry",
            "country": "France",
            "revenue": 420000000,
            "net_income": -12000000,
            "debt": 190000000,
            "shareholders_equity": -35000000,
            "free_cash_flow": 9000000,
            "ebitda": 48000000,
            "pe_ratio": 12.0,
            "net_margin": -2.9,
            "environmental_score": 52,
            "social_score": 58,
            "governance_score": 61,
        },
    )

    assert response.status_code == 200
    payload = response.json()

    assert payload["name"] == "Leveraged Turnaround"
    assert "balance_sheet" in payload["component_scores"]


def test_score_endpoint_penalizes_expensive_valuation_more_strongly() -> None:
    service = BuffettScoringService(repository=StaticCompanyRepository(_sample_companies()))
    service.train_from_repository()
    client = TestClient(create_app(service))

    fairly_priced_response = client.post(
        "/score",
        json={
            "name": "Fairly Priced Compounder",
            "sector": "technology",
            "country": "France",
            "revenue": 780000000,
            "net_income": 126000000,
            "debt": 58000000,
            "shareholders_equity": 490000000,
            "free_cash_flow": 132000000,
            "ebitda": 188000000,
            "pe_ratio": 14.0,
            "net_margin": 16.2,
            "environmental_score": 70,
            "social_score": 74,
            "governance_score": 82,
        },
    )
    expensive_response = client.post(
        "/score",
        json={
            "name": "Expensive Compounder",
            "sector": "technology",
            "country": "France",
            "revenue": 780000000,
            "net_income": 126000000,
            "debt": 58000000,
            "shareholders_equity": 490000000,
            "free_cash_flow": 132000000,
            "ebitda": 188000000,
            "pe_ratio": 39.0,
            "net_margin": 16.2,
            "environmental_score": 70,
            "social_score": 74,
            "governance_score": 82,
        },
    )

    assert fairly_priced_response.status_code == 200
    assert expensive_response.status_code == 200

    fairly_priced_payload = fairly_priced_response.json()
    expensive_payload = expensive_response.json()

    assert fairly_priced_payload["score"] > expensive_payload["score"]
    assert fairly_priced_payload["component_scores"]["valuation"] > expensive_payload["component_scores"]["valuation"]
