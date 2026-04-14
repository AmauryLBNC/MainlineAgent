from __future__ import annotations

from buffett_api.domain import CompanySnapshot
from buffett_api.scoring import build_feature_vector, compute_buffett_breakdown


def test_compute_buffett_breakdown_rewards_profitability_and_low_debt() -> None:
    snapshot = CompanySnapshot(
        company_id=1,
        slug="quality-compounder",
        name="Quality Compounder",
        sector="finance",
        country="France",
        revenue=900_000_000,
        net_income=180_000_000,
        debt=45_000_000,
        shareholders_equity=760_000_000,
        free_cash_flow=170_000_000,
        ebitda=240_000_000,
        pe_ratio=15.0,
        net_margin=20.0,
        environmental_score=72,
        social_score=78,
        governance_score=88,
    )

    breakdown = compute_buffett_breakdown(snapshot)
    features = build_feature_vector(snapshot)

    assert breakdown.overall_score >= 75
    assert breakdown.component_scores["balance_sheet"] >= 80
    assert features["debt_to_ebitda"] < 1


def test_compute_buffett_breakdown_penalizes_expensive_and_weak_cash_profiles() -> None:
    snapshot = CompanySnapshot(
        company_id=2,
        slug="fragile-growth",
        name="Fragile Growth",
        sector="technology",
        country="France",
        revenue=350_000_000,
        net_income=8_000_000,
        debt=220_000_000,
        shareholders_equity=90_000_000,
        free_cash_flow=6_000_000,
        ebitda=24_000_000,
        pe_ratio=41.0,
        net_margin=2.3,
        environmental_score=58,
        social_score=61,
        governance_score=54,
    )

    breakdown = compute_buffett_breakdown(snapshot)

    assert breakdown.overall_score < 50
    assert breakdown.component_scores["valuation"] < 35
    assert breakdown.component_scores["cash_generation"] < 35
    assert breakdown.component_scores["balance_sheet"] < 35


def test_compute_buffett_breakdown_penalizes_expensive_valuation_more_harshly() -> None:
    fairly_priced = CompanySnapshot(
        company_id=3,
        slug="fairly-priced",
        name="Fairly Priced",
        sector="technology",
        country="France",
        revenue=800_000_000,
        net_income=120_000_000,
        debt=50_000_000,
        shareholders_equity=520_000_000,
        free_cash_flow=125_000_000,
        ebitda=190_000_000,
        pe_ratio=14.0,
        net_margin=15.0,
        environmental_score=68,
        social_score=72,
        governance_score=80,
    )
    expensive = CompanySnapshot(
        company_id=4,
        slug="expensive-peer",
        name="Expensive Peer",
        sector="technology",
        country="France",
        revenue=800_000_000,
        net_income=120_000_000,
        debt=50_000_000,
        shareholders_equity=520_000_000,
        free_cash_flow=125_000_000,
        ebitda=190_000_000,
        pe_ratio=39.0,
        net_margin=15.0,
        environmental_score=68,
        social_score=72,
        governance_score=80,
    )

    fair_breakdown = compute_buffett_breakdown(fairly_priced)
    expensive_breakdown = compute_buffett_breakdown(expensive)

    assert fair_breakdown.component_scores["valuation"] > 50
    assert expensive_breakdown.component_scores["valuation"] < 5
    assert fair_breakdown.overall_score >= expensive_breakdown.overall_score + 8
