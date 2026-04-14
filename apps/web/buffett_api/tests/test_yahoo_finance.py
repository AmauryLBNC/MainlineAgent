from __future__ import annotations

import pandas as pd

from buffett_api.yahoo_finance import (
    extract_company_profile,
    normalize_search_quotes,
)


def test_normalize_search_quotes_keeps_equities_with_names() -> None:
    results = normalize_search_quotes(
        [
            {
                "symbol": "AAPL",
                "quoteType": "EQUITY",
                "longname": "Apple Inc.",
                "exchDisp": "NASDAQ",
                "sector": "Technology",
                "industry": "Consumer Electronics",
            },
            {
                "symbol": "SPY",
                "quoteType": "ETF",
                "longname": "SPDR S&P 500 ETF Trust",
            },
        ]
    )

    assert len(results) == 1
    assert results[0].symbol == "AAPL"
    assert results[0].exchange == "NASDAQ"


def test_extract_company_profile_maps_yahoo_fundamentals() -> None:
    balance_sheet = pd.DataFrame(
        {
            pd.Timestamp("2024-09-30"): {
                "Common Stock Equity": 73_733_000_000,
                "Total Debt": 98_657_000_000,
            }
        }
    )
    income_stmt = pd.DataFrame(
        {
            pd.Timestamp("2024-09-30"): {
                "Total Revenue": 435_617_005_568,
                "Net Income From Continuing Operation Net Minority Interest": 117_000_000_000,
                "EBITDA": 152_901_992_448,
            }
        }
    )
    cashflow = pd.DataFrame(
        {
            pd.Timestamp("2024-09-30"): {
                "Free Cash Flow": 106_312_753_152,
            }
        }
    )

    payload = extract_company_profile(
        "AAPL",
        {
            "longName": "Apple Inc.",
            "sector": "Technology",
            "industry": "Consumer Electronics",
            "country": "United States",
            "website": "https://www.apple.com",
            "currency": "USD",
            "city": "Cupertino",
            "state": "CA",
            "fullTimeEmployees": 150000,
            "companyOfficers": [
                {
                    "name": "Mr. Timothy D. Cook",
                    "title": "CEO & Director",
                }
            ],
            "trailingPE": 31.48,
            "profitMargins": 0.27037,
        },
        balance_sheet,
        income_stmt,
        cashflow,
    )

    assert payload["symbol"] == "AAPL"
    assert payload["sector"] == "technology"
    assert payload["industry"] == "Consumer Electronics"
    assert payload["revenue"] == 435_617_005_568
    assert payload["shareholders_equity"] == 73_733_000_000
    assert payload["ceo_name"] == "Mr. Timothy D. Cook"
    assert payload["ceo_title"] == "CEO & Director"
    assert payload["full_time_employees"] == 150000
    assert payload["city"] == "Cupertino"
    assert payload["state"] == "CA"
    assert round(payload["net_margin"], 2) == 27.04
