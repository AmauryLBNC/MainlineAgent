from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import pandas as pd
import yfinance as yf


SECTOR_ALIASES = {
    "technology": "technology",
    "healthcare": "health",
    "financial services": "finance",
    "financial": "finance",
    "industrials": "industry",
    "industrials": "industry",
    "consumer cyclical": "consumer",
    "consumer defensive": "consumer",
    "consumer staples": "consumer",
    "energy": "energy",
    "real estate": "real_estate",
    "utilities": "infrastructure",
    "communication services": "services",
    "basic materials": "industry",
}


@dataclass(frozen=True, slots=True)
class YahooSearchItem:
    symbol: str
    name: str
    exchange: str | None
    sector: str | None
    industry: str | None
    quote_type: str | None


def _extract_company_leadership(info: dict[str, Any]) -> tuple[str | None, str | None]:
    officers = info.get("companyOfficers")

    if not isinstance(officers, list):
        return None, None

    normalized_officers: list[tuple[int, str, str | None]] = []

    for officer in officers:
        if not isinstance(officer, dict):
            continue

        name = _clean_text(officer.get("name"))
        title = _clean_text(officer.get("title"))

        if not name:
            continue

        normalized_title = (title or "").lower()
        priority = 0

        if "chief executive officer" in normalized_title or normalized_title.startswith(
            "ceo"
        ):
            priority = 3
        elif " ceo" in normalized_title or "ceo " in normalized_title:
            priority = 2
        elif "chief executive" in normalized_title:
            priority = 1

        normalized_officers.append((priority, name, title))

    if not normalized_officers:
        return None, None

    normalized_officers.sort(key=lambda item: item[0], reverse=True)
    _, ceo_name, ceo_title = normalized_officers[0]
    return ceo_name, ceo_title


def _clean_text(value: Any) -> str | None:
    if value is None:
        return None

    text = str(value).strip()
    return text or None


def _clean_number(value: Any) -> float | None:
    if value is None:
        return None

    if isinstance(value, bool):
        return None

    try:
        cleaned_value = float(value)
    except (TypeError, ValueError):
        return None

    if pd.isna(cleaned_value):
        return None

    return cleaned_value


def normalize_sector(sector: str | None) -> str:
    normalized = (sector or "").strip().lower()

    if not normalized:
        return "services"

    return SECTOR_ALIASES.get(normalized, normalized.replace(" ", "_"))


def extract_first_statement_value(
    statement: pd.DataFrame,
    labels: tuple[str, ...],
) -> float | None:
    if statement.empty:
        return None

    first_column = statement.columns[0]

    for label in labels:
        if label not in statement.index:
            continue

        return _clean_number(statement.at[label, first_column])

    return None


def normalize_search_quotes(quotes: list[dict[str, Any]]) -> list[YahooSearchItem]:
    results: list[YahooSearchItem] = []

    for quote in quotes:
        if quote.get("quoteType") != "EQUITY":
            continue

        symbol = _clean_text(quote.get("symbol"))
        name = _clean_text(quote.get("longname")) or _clean_text(quote.get("shortname"))

        if not symbol or not name:
            continue

        results.append(
            YahooSearchItem(
                symbol=symbol,
                name=name,
                exchange=_clean_text(quote.get("exchDisp") or quote.get("exchange")),
                sector=_clean_text(quote.get("sector")),
                industry=_clean_text(quote.get("industry")),
                quote_type=_clean_text(quote.get("quoteType")),
            )
        )

    return results


def extract_company_profile(
    symbol: str,
    info: dict[str, Any],
    balance_sheet: pd.DataFrame,
    income_stmt: pd.DataFrame,
    cashflow: pd.DataFrame,
) -> dict[str, Any]:
    ceo_name, ceo_title = _extract_company_leadership(info)
    revenue = _clean_number(info.get("totalRevenue")) or extract_first_statement_value(
        income_stmt,
        ("Total Revenue", "Operating Revenue", "Revenue"),
    )
    net_income = extract_first_statement_value(
        income_stmt,
        (
            "Net Income",
            "Net Income Common Stockholders",
            "Net Income From Continuing And Discontinued Operation",
            "Net Income From Continuing Operation Net Minority Interest",
        ),
    )
    debt = _clean_number(info.get("totalDebt")) or extract_first_statement_value(
        balance_sheet,
        ("Total Debt", "Net Debt"),
    )
    shareholders_equity = extract_first_statement_value(
        balance_sheet,
        (
            "Common Stock Equity",
            "Stockholders Equity",
            "Total Equity Gross Minority Interest",
            "Total Equity",
        ),
    )
    free_cash_flow = _clean_number(
        info.get("freeCashflow")
    ) or extract_first_statement_value(cashflow, ("Free Cash Flow",))
    ebitda = _clean_number(info.get("ebitda")) or extract_first_statement_value(
        income_stmt,
        ("EBITDA", "Normalized EBITDA"),
    )
    pe_ratio = _clean_number(info.get("trailingPE"))
    net_margin = _clean_number(info.get("profitMargins"))
    return_on_equity = _clean_number(info.get("returnOnEquity"))

    if net_margin is not None:
        net_margin *= 100.0

    if shareholders_equity is None and return_on_equity and net_income:
        if abs(return_on_equity) > 1e-9:
            shareholders_equity = net_income / return_on_equity

    return {
        "symbol": symbol.upper(),
        "name": _clean_text(info.get("longName")) or _clean_text(info.get("shortName")) or symbol.upper(),
        "sector": normalize_sector(_clean_text(info.get("sector"))),
        "industry": _clean_text(info.get("industry")),
        "market_price": _clean_number(info.get("regularMarketPrice"))
        or _clean_number(info.get("currentPrice")),
        "country": _clean_text(info.get("country")),
        "exchange": _clean_text(info.get("exchange")) or _clean_text(info.get("fullExchangeName")),
        "currency": _clean_text(info.get("currency")),
        "website": _clean_text(info.get("website")),
        "city": _clean_text(info.get("city")),
        "state": _clean_text(info.get("state")),
        "full_time_employees": _clean_number(info.get("fullTimeEmployees")),
        "ceo_name": ceo_name,
        "ceo_title": ceo_title,
        "summary": _clean_text(info.get("longBusinessSummary")),
        "revenue": revenue,
        "net_income": net_income,
        "debt": debt,
        "shareholders_equity": shareholders_equity,
        "free_cash_flow": free_cash_flow,
        "ebitda": ebitda,
        "pe_ratio": pe_ratio,
        "net_margin": net_margin,
        "environmental_score": 60.0,
        "social_score": 60.0,
        "governance_score": 60.0,
        "source": "yahoo_finance",
    }


class YahooFinanceService:
    def search_companies(self, query: str) -> list[dict[str, Any]]:
        sanitized_query = query.strip()

        if len(sanitized_query) < 2:
            return []

        search = yf.Search(
            sanitized_query,
            max_results=8,
            news_count=0,
            lists_count=0,
            include_nav_links=False,
            include_research=False,
            raise_errors=True,
        )

        return [
            {
                "symbol": result.symbol,
                "name": result.name,
                "exchange": result.exchange,
                "sector": result.sector,
                "industry": result.industry,
                "quote_type": result.quote_type,
            }
            for result in normalize_search_quotes(search.quotes or [])
        ]

    def get_company_profile(self, symbol: str) -> dict[str, Any]:
        sanitized_symbol = symbol.strip().upper()

        if not sanitized_symbol:
            raise ValueError("Le ticker Yahoo Finance est obligatoire.")

        ticker = yf.Ticker(sanitized_symbol)
        return extract_company_profile(
            sanitized_symbol,
            ticker.info or {},
            ticker.balance_sheet,
            ticker.income_stmt,
            ticker.cashflow,
        )
