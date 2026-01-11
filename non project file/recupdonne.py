# Salut c'est Greg
# CAC40 fundamentals + CAGR with yfinance
# pip install yfinance pandas lxml html5lib

from __future__ import annotations

import math
import time
from dataclasses import dataclass
from typing import Optional, Dict, List, Tuple

import pandas as pd
import yfinance as yf
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry
from io import StringIO


# ---------- Helpers: robust line item extraction ----------

def _norm(s: str) -> str:
    return "".join(ch.lower() for ch in s if ch.isalnum() or ch.isspace()).strip()

def pick_line(df: pd.DataFrame, candidates: List[str]) -> Optional[pd.Series]:
    """
    Find the first matching row in a financial statement dataframe by fuzzy name matching.
    df index is expected to be line items, columns are dates.
    Returns a Series indexed by dates, or None if not found.
    """
    if df is None or df.empty:
        return None

    idx_norm = {_norm(str(i)): i for i in df.index}
    cand_norm = [_norm(c) for c in candidates]

    # Exact normalized match
    for cn in cand_norm:
        if cn in idx_norm:
            return df.loc[idx_norm[cn]]

    # Contains match (fallback)
    for cn in cand_norm:
        for k_norm, k_raw in idx_norm.items():
            if cn and cn in k_norm:
                return df.loc[k_raw]

    return None


def to_float(x) -> Optional[float]:
    try:
        if x is None or (isinstance(x, float) and math.isnan(x)):
            return None
        return float(x)
    except Exception:
        return None


def cagr(first: Optional[float], last: Optional[float], years: int) -> Optional[float]:
    """
    CAGR over 'years' intervals. Returns None if invalid (<=0, missing, years<=0).
    """
    if first is None or last is None or years <= 0:
        return None
    if first <= 0 or last <= 0:
        return None
    return (last / first) ** (1.0 / years) - 1.0


# ---------- CAC40 tickers from Yahoo components page ----------

def _extract_symbols_from_tables(tables: List[pd.DataFrame]) -> List[str]:
    """
    Extract possible ticker symbols from a list of HTML tables.
    Looks for several column name variants (Symbol, Ticker, Ticker symbol, Mnemonique).
    """
    candidates = {_norm(c) for c in ["Symbol", "Ticker", "Ticker symbol", "Mnemonique", "Mnemonic"]}
    symbols: List[str] = []
    for t in tables:
        for col in t.columns:
            if _norm(str(col)) in candidates:
                symbols.extend(t[col].dropna().astype(str).tolist())
                break
    return symbols


def _clean_tickers(raw: List[str], default_suffix: str = ".PA") -> List[str]:
    """
    Normalize ticker strings and add a default suffix when missing a market suffix.
    Keeps order while deduplicating.
    """
    seen = set()
    cleaned: List[str] = []
    for r in raw:
        s = str(r).strip().upper()
        if not s or s == "NAN":
            continue
        if default_suffix and "." not in s and not s.endswith(default_suffix.upper()):
            s = f"{s}{default_suffix}"
        if s not in seen:
            seen.add(s)
            cleaned.append(s)
    return cleaned


def fetch_cac40_tickers(retries: int = 5, backoff_factor: float = 1.0, polite_sleep_s: float = 0.5) -> List[str]:
    """
    Fetch CAC40 components from Yahoo Finance with a resilient HTTP session.

    Uses a requests.Session with retries and a browser-like User-Agent header to
    avoid simple bot detection that often triggers HTTP 429 (Too Many Requests).

    Parameters:
      - retries: number of retries for transient errors (including 429)
      - backoff_factor: factor for exponential backoff between retries
      - polite_sleep_s: small sleep after the request to be polite
    """
    url = "https://finance.yahoo.com/quote/%5EFCHI/components"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    session = requests.Session()
    retry = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    errors = []

    # Try Yahoo components page first
    try:
        resp = session.get(url, headers=headers, timeout=15)
        # If server returned 429 after exhausting retries, surface a helpful error
        if resp.status_code == 429:
            raise RuntimeError(
                "HTTP 429 Too Many Requests when fetching Yahoo components. "
                "Try again later, increase backoff, or add more polite delays."
            )
        resp.raise_for_status()
        time.sleep(polite_sleep_s)
        tables = pd.read_html(StringIO(resp.text))
        tickers = _clean_tickers(_extract_symbols_from_tables(tables))
        if tickers:
            return tickers
        errors.append("Yahoo: no ticker column found")
    except Exception as e:
        errors.append(f"Yahoo: {e}")

    # Fallback: Wikipedia CAC 40 constituents table (stable HTML tables)
    try:
        wiki_url = "https://en.wikipedia.org/wiki/CAC_40"
        resp = session.get(wiki_url, headers=headers, timeout=15)
        resp.raise_for_status()
        time.sleep(polite_sleep_s)
        tables = pd.read_html(StringIO(resp.text))
        tickers = _clean_tickers(_extract_symbols_from_tables(tables))
        if tickers:
            return tickers
        errors.append("Wikipedia: no ticker column found")
    except Exception as e:
        errors.append(f"Wikipedia: {e}")

    raise RuntimeError(f"Failed to fetch CAC40 tickers. Sources errors: {errors}")


# ---------- Main extraction per company ----------

@dataclass
class AnnualMetrics:
    year: int
    revenue: Optional[float]
    net_income: Optional[float]
    margin: Optional[float]
    cash: Optional[float]
    debt_short: Optional[float]
    debt_long: Optional[float]
    capex: Optional[float]
    capex_over_revenue: Optional[float]
    per: Optional[float]


def extract_annual_series(t: yf.Ticker) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Returns (income_stmt, balance_sheet, cash_flow) as annual statement dataframes.
    yfinance output varies by version; we try both "get_*" and properties.
    """
    income = None
    bal = None
    cf = None

    # Newer yfinance versions provide get_* methods
    for fn_name, attr in [
        ("get_income_stmt", "income_stmt"),
        ("get_balance_sheet", "balance_sheet"),
        ("get_cash_flow", "cash_flow"),
    ]:
        try:
            if hasattr(t, fn_name):
                fn = getattr(t, fn_name)
                if fn_name == "get_income_stmt":
                    income = fn(freq="annual")
                elif fn_name == "get_balance_sheet":
                    bal = fn(freq="annual")
                else:
                    cf = fn(freq="annual")
        except Exception:
            pass

    # Fallback: properties
    try:
        if income is None:
            income = getattr(t, "financials", None) or getattr(t, "income_stmt", None)
    except Exception:
        pass
    try:
        if bal is None:
            bal = getattr(t, "balance_sheet", None)
    except Exception:
        pass
    try:
        if cf is None:
            cf = getattr(t, "cashflow", None) or getattr(t, "cash_flow", None)
    except Exception:
        pass

    # Ensure DataFrame
    income = income if isinstance(income, pd.DataFrame) else pd.DataFrame()
    bal = bal if isinstance(bal, pd.DataFrame) else pd.DataFrame()
    cf = cf if isinstance(cf, pd.DataFrame) else pd.DataFrame()

    return income, bal, cf


def build_annual_metrics(symbol: str, polite_sleep_s: float = 0.3) -> Tuple[pd.DataFrame, Dict[str, Optional[float]]]:
    """
    Returns:
      - annual_df: rows = years, columns = requested raw metrics
      - summary: CAGR metrics computed from available annual_df span
    """
    t = yf.Ticker(symbol)
    print(t)
    # PER (approx): trailingPE from info (may be None)
    per = None
    try:
        info = t.get_info() if hasattr(t, "get_info") else t.info
        per = to_float(info.get("trailingPE", None))
    except Exception:
        per = None
    print(info)
    income, bal, cf = extract_annual_series(t)

    # Pick line items (name variations happen)
    s_rev = pick_line(income, ["Total Revenue", "Revenue"])
    s_ni  = pick_line(income, ["Net Income", "Net Income Common Stockholders", "Net Income Continuous Operations"])

    s_cash = pick_line(bal, [
        "Cash And Cash Equivalents",
        "Cash Cash Equivalents And Short Term Investments",
        "Cash And Cash Equivalents At Carrying Value",
        "Cash And Short Term Investments",
    ])

    # Debt short / long are messy; these candidates cover many issuers
    s_debt_short = pick_line(bal, [
        "Short Long Term Debt",
        "Short Term Debt",
        "Current Debt",
        "Short Term Borrowings",
        "Current Debt And Capital Lease Obligation",
    ])

    s_debt_long = pick_line(bal, [
        "Long Term Debt",
        "Long Term Debt Noncurrent",
        "Long Term Debt And Capital Lease Obligation",
        "Long Term Borrowings",
    ])

    s_capex = pick_line(cf, [
        "Capital Expenditure",
        "Capital Expenditures",
        "Purchase Of Property Plant Equipment",
    ])

    # Build annual table indexed by year (int)
    # yfinance columns are usually timestamps; normalize to year
    years = set()
    for s in [s_rev, s_ni, s_cash, s_debt_short, s_debt_long, s_capex]:
        if s is not None:
            for d in s.index:
                try:
                    years.add(pd.to_datetime(d).year)
                except Exception:
                    pass

    years = sorted(years)
    rows: List[AnnualMetrics] = []
    print (rows)
    for y in years:
        def get_at(series: Optional[pd.Series]) -> Optional[float]:
            if series is None:
                return None
            for d in series.index:
                try:
                    if pd.to_datetime(d).year == y:
                        return to_float(series.loc[d])
                except Exception:
                    continue
            return None

        rev = get_at(s_rev)
        ni = get_at(s_ni)
        cash = get_at(s_cash)
        debt_s = get_at(s_debt_short)
        debt_l = get_at(s_debt_long)

        capex_raw = get_at(s_capex)
        # Capex often negative (cash outflow). Make it positive for ratio
        capex = abs(capex_raw) if capex_raw is not None else None

        margin = (ni / rev) if (ni is not None and rev not in (None, 0)) else None
        capex_over_rev = (capex / rev) if (capex is not None and rev not in (None, 0)) else None

        rows.append(AnnualMetrics(
            year=y,
            revenue=rev,
            net_income=ni,
            margin=margin,
            cash=cash,
            debt_short=debt_s,
            debt_long=debt_l,
            capex=capex,
            capex_over_revenue=capex_over_rev,
            per=per,  # PER is point-in-time; repeated each year here for convenience
        ))

    annual_df = pd.DataFrame([r.__dict__ for r in rows]).set_index("year").sort_index()

    # CAGR over the full available span
    summary: Dict[str, Optional[float]] = {}
    if not annual_df.empty:
        print (annual_df)
        y0 = int(annual_df.index.min())
        y1 = int(annual_df.index.max())
        n = y1 - y0

        summary["span_years"] = n
        print(to_float(annual_df.loc[y0, "revenue"]),to_float(annual_df.loc[y1, "revenue"]))
        summary["CAGR_CA"] = cagr(to_float(annual_df.loc[y0, "revenue"]), to_float(annual_df.loc[y1, "revenue"]), n)
        summary["CAGR_resultat_net"] = cagr(to_float(annual_df.loc[y0, "net_income"]), to_float(annual_df.loc[y1, "net_income"]), n)

        # For margin CAGR: need positive values; margin can be negative → we skip if invalid
        summary["CAGR_marge"] = cagr(to_float(annual_df.loc[y0, "margin"]), to_float(annual_df.loc[y1, "margin"]), n)

        summary["CAGR_tresorerie"] = cagr(to_float(annual_df.loc[y0, "cash"]), to_float(annual_df.loc[y1, "cash"]), n)
        summary["CAGR_endettement_CT"] = cagr(to_float(annual_df.loc[y0, "debt_short"]), to_float(annual_df.loc[y1, "debt_short"]), n)
        summary["CAGR_endettement_LT"] = cagr(to_float(annual_df.loc[y0, "debt_long"]), to_float(annual_df.loc[y1, "debt_long"]), n)

        # Latest point values (what you asked)
        summary["chiffre_affaire"] = to_float(annual_df.loc[y1, "revenue"])
        summary["resultat_net"] = to_float(annual_df.loc[y1, "net_income"])
        summary["marge"] = to_float(annual_df.loc[y1, "margin"])
        summary["tresorerie"] = to_float(annual_df.loc[y1, "cash"])
        summary["endettement_CT"] = to_float(annual_df.loc[y1, "debt_short"])
        summary["endettement_LT"] = to_float(annual_df.loc[y1, "debt_long"])
        summary["CAPEX_sur_CA"] = to_float(annual_df.loc[y1, "capex_over_revenue"])
        summary["PER"] = per

    time.sleep(polite_sleep_s)
    return annual_df, summary


# ---------- Run for CAC40 and export ----------

def main():
    new_tickers = [
        "OR.PA",    # L'Oréal
        "TTE.PA",   # TotalEnergies
        "AIR.PA",   # Airbus
        "SAN.PA",   # Sanofi
        "BN.PA",    # Danone
        "AI.PA",    # Air Liquide
        "CA.PA",    # Carrefour
        "SU.PA",    # Schneider Electric
        "DG.PA",    # Vinci
        "VIE.PA",   # Veolia
        "CAP.PA",   # Capgemini
        "BNP.PA",   # BNP Paribas
        "ORA.PA",   # Orange
        "DSY.PA",   # Dassault Systèmes
        "KER.PA",   # Kering
        "PUB.PA",   # Publicis
        "RNO.PA",   # Renault
        "SAF.PA",   # Safran
        "RMS.PA",   # Hermès
        "ENGI.PA"   # Engie
    ]

    # Ajout à la liste existante

    tickers = fetch_cac40_tickers()
    tickers.extend(new_tickers)
    print(f"{len(tickers)} tickers CAC40 détectés via Yahoo components.")
    summaries = []
    annual_panels = []

    for i, sym in enumerate(tickers, 1):
        try:
            annual_df, summary = build_annual_metrics(sym)
            summary["ticker"] = sym
            summaries.append(summary)

            # store long format for annual table
            if not annual_df.empty:
                long = annual_df.copy()
                long["ticker"] = sym
                long = long.reset_index().rename(columns={"index": "year"})
                annual_panels.append(long)

            print(f"[{i:02d}/{len(tickers)}] OK {sym} (années: {summary.get('span_years', None)})")
        except Exception as e:
            print(f"[{i:02d}/{len(tickers)}] FAIL {sym}: {e}")
            summaries.append({"ticker": sym})

    df_summary = pd.DataFrame(summaries).set_index("ticker").sort_index()
    df_annual = pd.concat(annual_panels, ignore_index=True) if annual_panels else pd.DataFrame()

    df_summary.to_csv("cac40_summary_metrics.csv", index=True)
    df_annual.to_csv("cac40_annual_raw.csv", index=False)

    print("✅ Export terminé :")
    print(" - cac40_summary_metrics.csv (CAGR + dernières valeurs)")
    print(" - cac40_annual_raw.csv (table annuelle brute par entreprise)")


if __name__ == "__main__":
    main()
