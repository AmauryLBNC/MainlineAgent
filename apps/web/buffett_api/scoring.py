from __future__ import annotations

from .domain import BuffettBreakdown, CompanySnapshot


FEATURE_NAMES = (
    "revenue_millions",
    "net_margin_pct",
    "return_on_equity_pct",
    "ebitda_margin_pct",
    "fcf_margin_pct",
    "cash_conversion_ratio",
    "debt_to_ebitda",
    "debt_to_fcf",
    "debt_to_equity",
    "pe_ratio",
    "earnings_yield_pct",
    "governance_score",
    "social_score",
    "environmental_score",
    "sector_durability_score",
)

SECTOR_DURABILITY_SCORES = {
    "technology": 82.0,
    "health": 88.0,
    "finance": 84.0,
    "industry": 72.0,
    "consumer": 76.0,
    "energy": 58.0,
}


def clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return max(minimum, min(maximum, float(value)))


def safe_float(value: float | int | None, fallback: float = 0.0) -> float:
    if value is None:
        return fallback

    return float(value)


def safe_ratio(
    numerator: float | int | None,
    denominator: float | int | None,
    fallback: float,
) -> float:
    numerator_value = safe_float(numerator)
    denominator_value = safe_float(denominator)

    if abs(denominator_value) < 1e-9:
        return fallback

    return numerator_value / denominator_value


def scale_between(value: float, lower: float, upper: float) -> float:
    if value <= lower:
        return 0.0

    if value >= upper:
        return 100.0

    return ((value - lower) / (upper - lower)) * 100.0


def inverse_scale(value: float, lower: float, upper: float) -> float:
    if value <= lower:
        return 100.0

    if value >= upper:
        return 0.0

    return ((upper - value) / (upper - lower)) * 100.0


def get_sector_durability_score(sector: str | None) -> float:
    normalized_sector = (sector or "").strip().lower()
    return SECTOR_DURABILITY_SCORES.get(normalized_sector, 65.0)


def build_feature_vector(snapshot: CompanySnapshot) -> dict[str, float]:
    revenue = max(safe_float(snapshot.revenue, 0.0), 1.0)
    net_income = safe_float(snapshot.net_income, 0.0)
    debt = max(safe_float(snapshot.debt, 0.0), 0.0)
    shareholders_equity = safe_float(snapshot.shareholders_equity, 0.0)
    free_cash_flow = safe_float(snapshot.free_cash_flow, 0.0)
    ebitda = safe_float(snapshot.ebitda, 0.0)
    pe_ratio = max(safe_float(snapshot.pe_ratio, 0.0), 0.0)
    governance_score = clamp(safe_float(snapshot.governance_score, 60.0))
    social_score = clamp(safe_float(snapshot.social_score, 60.0))
    environmental_score = clamp(safe_float(snapshot.environmental_score, 60.0))
    sector_score = get_sector_durability_score(snapshot.sector)

    net_margin_pct = safe_float(snapshot.net_margin)
    if snapshot.net_margin is None:
        net_margin_pct = safe_ratio(net_income, revenue, 0.0) * 100.0

    ebitda_margin_pct = safe_ratio(ebitda, revenue, 0.0) * 100.0
    fcf_margin_pct = safe_ratio(free_cash_flow, revenue, 0.0) * 100.0
    return_on_equity_pct = (
        safe_ratio(net_income, shareholders_equity, 0.0) * 100.0
        if shareholders_equity > 0
        else 0.0
    )
    cash_conversion_ratio = (
        safe_ratio(free_cash_flow, net_income, 0.0) if net_income > 0 else 0.0
    )
    debt_to_ebitda = debt / ebitda if ebitda > 0 else 8.0
    debt_to_fcf = debt / free_cash_flow if free_cash_flow > 0 else 10.0
    debt_to_equity = debt / shareholders_equity if shareholders_equity > 0 else 5.0
    earnings_yield_pct = (100.0 / pe_ratio) if pe_ratio > 0 else 0.0

    return {
        "revenue_millions": revenue / 1_000_000.0,
        "net_margin_pct": clamp(net_margin_pct, -40.0, 60.0),
        "return_on_equity_pct": clamp(return_on_equity_pct, -40.0, 45.0),
        "ebitda_margin_pct": clamp(ebitda_margin_pct, -30.0, 65.0),
        "fcf_margin_pct": clamp(fcf_margin_pct, -30.0, 50.0),
        "cash_conversion_ratio": clamp(cash_conversion_ratio, 0.0, 3.0),
        "debt_to_ebitda": clamp(debt_to_ebitda, 0.0, 8.0),
        "debt_to_fcf": clamp(debt_to_fcf, 0.0, 10.0),
        "debt_to_equity": clamp(debt_to_equity, 0.0, 5.0),
        "pe_ratio": clamp(pe_ratio, 0.0, 60.0),
        "earnings_yield_pct": clamp(earnings_yield_pct, 0.0, 25.0),
        "governance_score": governance_score,
        "social_score": social_score,
        "environmental_score": environmental_score,
        "sector_durability_score": sector_score,
    }


def get_score_tier(score: float) -> str:
    if score >= 85.0:
        return "excellent"

    if score >= 75.0:
        return "solide"

    if score >= 65.0:
        return "correct"

    return "prudence"


def compute_breakdown_from_features(
    features: dict[str, float],
) -> BuffettBreakdown:
    profitability_score = clamp(
        0.40 * scale_between(features["net_margin_pct"], 6.0, 20.0)
        + 0.30 * scale_between(features["ebitda_margin_pct"], 12.0, 28.0)
        + 0.30 * scale_between(features["return_on_equity_pct"], 10.0, 24.0)
    )
    cash_generation_score = clamp(
        0.55 * scale_between(features["fcf_margin_pct"], 4.0, 18.0)
        + 0.45 * scale_between(features["cash_conversion_ratio"], 0.75, 1.40)
    )
    balance_sheet_score = clamp(
        0.40 * inverse_scale(features["debt_to_ebitda"], 0.75, 3.25)
        + 0.30 * inverse_scale(features["debt_to_fcf"], 1.0, 4.5)
        + 0.30 * inverse_scale(features["debt_to_equity"], 0.35, 1.40)
    )
    valuation_score = clamp(
        0.55 * scale_between(features["earnings_yield_pct"], 5.5, 9.5)
        + 0.45 * inverse_scale(features["pe_ratio"], 11.0, 22.0)
    )
    durability_score = clamp(
        0.45 * features["governance_score"]
        + 0.20 * features["social_score"]
        + 0.15 * features["environmental_score"]
        + 0.20 * features["sector_durability_score"]
    )

    overall_score = round(
        clamp(
            0.27 * profitability_score
            + 0.21 * cash_generation_score
            + 0.18 * balance_sheet_score
            + 0.22 * valuation_score
            + 0.12 * durability_score
        ),
        2,
    )

    rationale: list[str] = []

    if profitability_score >= 75.0:
        rationale.append("Rentabilite operationnelle compatible avec une logique Buffett.")
    elif profitability_score < 50.0:
        rationale.append("Rentabilite encore trop faible pour une these long terme sereine.")

    if features["return_on_equity_pct"] >= 18.0:
        rationale.append("Le rendement des fonds propres renforce la qualite economique du dossier.")
    elif 0.0 < features["return_on_equity_pct"] < 8.0:
        rationale.append("Le rendement des fonds propres reste modeste pour un actif de grande qualite.")

    if cash_generation_score >= 75.0:
        rationale.append("Le cash-flow libre confirme bien la qualite des resultats.")
    elif cash_generation_score < 50.0:
        rationale.append("La conversion du resultat en cash reste insuffisante.")

    if balance_sheet_score >= 75.0:
        rationale.append("Le bilan est discipline avec un levier modere.")
    elif balance_sheet_score < 50.0:
        rationale.append("Le niveau d'endettement merite davantage de prudence.")

    if features["debt_to_equity"] <= 0.45:
        rationale.append("Les fonds propres couvrent confortablement le levier financier.")
    elif features["debt_to_equity"] >= 1.20:
        rationale.append("La dette pese lourdement face aux fonds propres.")

    if valuation_score >= 70.0:
        rationale.append("La valorisation reste raisonnable au regard des profits.")
    elif valuation_score < 45.0:
        rationale.append("La valorisation semble trop tendue pour offrir une marge de securite.")

    if durability_score >= 75.0:
        rationale.append("La durabilite du modele economique et la gouvernance sont solides.")
    elif durability_score < 55.0:
        rationale.append("Le caractere defensif ou la gouvernance doivent etre renforces.")

    if not rationale:
        rationale.append("Profil intermediaire avec quelques qualites Buffett mais sans avantage net.")

    component_scores = {
        "profitability": round(profitability_score, 2),
        "cash_generation": round(cash_generation_score, 2),
        "balance_sheet": round(balance_sheet_score, 2),
        "valuation": round(valuation_score, 2),
        "durability": round(durability_score, 2),
    }

    return BuffettBreakdown(
        overall_score=overall_score,
        component_scores=component_scores,
        tier=get_score_tier(overall_score),
        rationale=tuple(rationale),
    )


def compute_buffett_breakdown(snapshot: CompanySnapshot) -> BuffettBreakdown:
    return compute_breakdown_from_features(build_feature_vector(snapshot))


def vectorize_features(features: dict[str, float]) -> list[float]:
    return [float(features[name]) for name in FEATURE_NAMES]
