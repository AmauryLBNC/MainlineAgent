import yfinance as yf
import pandas as pd
import numpy as np
import requests
# ======================
# PARAMÈTRES
# ======================
NB_YEARS = 5
OUTPUT_FILE = "xgboost_test_data_500.csv"

# ======================
# RÉCUPÉRATION DES 500 TICKERS (S&P 500)
# ======================
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
r = requests.get(sp500_url)
sp500_table = pd.read_html(sp500_url)[0]

# yfinance utilise - au lieu de .
TICKERS = sp500_table["Symbol"].str.replace(".", "-", regex=False).tolist()

print(f"✔ {len(TICKERS)} tickers récupérés")

# ======================
# OUTILS
# ======================
def safe_get(df, row):
    try:
        return df.loc[row].dropna()
    except:
        return None

def cagr(series):
    if series is None or len(series) < 2:
        return np.nan
    s = series.sort_index()
    start, end = s.iloc[-1], s.iloc[0]
    n = len(s) - 1
    if start <= 0 or end <= 0:
        return np.nan
    return (end / start) ** (1 / n) - 1

# ======================
# COLLECTE
# ======================
rows = []

for i, ticker in enumerate(TICKERS, 1):
    print(f"[{i}/{len(TICKERS)}] Processing {ticker}")

    try:
        t = yf.Ticker(ticker)

        inc = t.financials
        bal = t.balance_sheet
        cf = t.cashflow
        info = t.info

        row = {"ticker": ticker}

        ca = safe_get(inc, "Total Revenue")
        rn = safe_get(inc, "Net Income")
        capex = safe_get(cf, "Capital Expenditure")
        cfo = safe_get(cf, "Total Cash From Operating Activities")
        debt_lt = safe_get(bal, "Long Term Debt")
        debt_st = safe_get(bal, "Short Long Term Debt")
        cash = safe_get(bal, "Cash")

        if ca is not None:
            row["ca"] = ca.iloc[0]
            row["cagr_ca"] = cagr(ca.head(NB_YEARS))

        if rn is not None:
            row["resultat_net"] = rn.iloc[0]
            row["cagr_resultat_net"] = cagr(rn.head(NB_YEARS))

        if ca is not None and rn is not None:
            marge = rn / ca
            row["marge"] = marge.iloc[0]
            row["cagr_marge"] = cagr(marge.head(NB_YEARS))

        if debt_lt is not None:
            row["endettement_long_terme"] = debt_lt.iloc[0]
            row["cagr_endettement_lt"] = cagr(debt_lt.head(NB_YEARS))

        if debt_st is not None:
            row["endettement_court_terme"] = debt_st.iloc[0]
            row["cagr_endettement_ct"] = cagr(debt_st.head(NB_YEARS))

        if cash is not None:
            row["tresorerie"] = cash.iloc[0]
            row["cagr_tresorerie"] = cagr(cash.head(NB_YEARS))

        if capex is not None and ca is not None:
            row["capex_sur_ca"] = abs(capex.iloc[0]) / ca.iloc[0]

        if cfo is not None and rn is not None and rn.iloc[0] != 0:
            row["qualite_resultat"] = cfo.iloc[0] / rn.iloc[0]

        if "trailingPE" in info and info["trailingPE"] is not None:
            row["per"] = info["trailingPE"]

        rows.append(row)

    except Exception as e:
        print(f"⚠️ Erreur sur {ticker}: {e}")

# ======================
# DATAFRAME FINAL
# ======================
df = pd.DataFrame(rows)

# target pour XGBoost (score 0–100 à remplir plus tard)
df["target"] = 0

# ======================
# EXPORT
# ======================
df.to_csv(OUTPUT_FILE, index=False)

print(f"\n✅ CSV généré : {OUTPUT_FILE}")
print(df.head())
print(f"\n✔ {len(df)} entreprises exploitables")
