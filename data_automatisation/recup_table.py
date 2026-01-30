import pandas as pd
import re
from pathlib import Path

ROOT = Path("data/sec_10k")

# =========================================================
# FILTRES STRUCTURELS (CLÉS)
# =========================================================

def has_numbers(df: pd.DataFrame) -> bool:
    text = " ".join(df.astype(str).values.flatten())
    return bool(re.search(r"\d{2,}", text))

def is_large_enough(df: pd.DataFrame) -> bool:
    return df.shape[0] >= 10 and df.shape[1] >= 2

def has_descriptive_first_column(df: pd.DataFrame) -> bool:
    first_col = df.iloc[:, 0].astype(str).str.lower()
    keywords = [
        "revenue", "sales", "income", "loss",
        "expense", "cost", "cash", "tax",
        "assets", "liabilities", "equity"
    ]
    return any(first_col.str.contains(k).any() for k in keywords)

def is_index_or_page_table(df: pd.DataFrame) -> bool:
    text = " ".join(df.astype(str).values.flatten()).lower()
    blacklist = [
        "index to consolidated financial statements",
        "page",
        "report of independent registered public accounting firm",
        "notes to consolidated financial statements"
    ]
    return any(b in text for b in blacklist)

# =========================================================
# DÉTECTION DES VRAIS ÉTATS FINANCIERS
# =========================================================

def is_income_statement(df: pd.DataFrame) -> bool:
    text = " ".join(df.astype(str).values.flatten()).lower()
    return (
        "net income" in text or "net loss" in text
    ) and has_numbers(df) and is_large_enough(df) and has_descriptive_first_column(df)

def is_cashflow_statement(df: pd.DataFrame) -> bool:
    text = " ".join(df.astype(str).values.flatten()).lower()
    return (
        "operating activities" in text
        and "cash" in text
        and has_numbers(df)
        and is_large_enough(df)
        and has_descriptive_first_column(df)
    )

def is_shares_table(df: pd.DataFrame) -> bool:
    text = " ".join(df.astype(str).values.flatten()).lower()
    return (
        "shares outstanding" in text or "common stock" in text
    ) and has_numbers(df)

# =========================================================
# PIPELINE PAR DOSSIER
# =========================================================

def process_year_folder(year_dir: Path):
    html_files = list(year_dir.glob("*.htm")) + list(year_dir.glob("*.html"))
    if not html_files:
        return

    html_file = html_files[0]
    print(f"[READ] {html_file}")

    try:
        tables = pd.read_html(html_file)
    except Exception as e:
        print(f"[ERROR] Impossible de lire HTML : {e}")
        return

    income = cashflow = shares = None

    for df in tables:
        if is_index_or_page_table(df):
            continue

        if income is None and is_income_statement(df):
            income = df
            continue

        if cashflow is None and is_cashflow_statement(df):
            cashflow = df
            continue

        if shares is None and is_shares_table(df):
            shares = df

    if income is not None:
        income.to_csv(year_dir / "income_statement.csv", index=False)
        print("  ✔ income_statement")

    if cashflow is not None:
        cashflow.to_csv(year_dir / "cashflow_statement.csv", index=False)
        print("  ✔ cashflow_statement")

    if shares is not None:
        shares.to_csv(year_dir / "shares_outstanding.csv", index=False)
        print("  ✔ shares_outstanding")

    if income is None and cashflow is None and shares is None:
        print("  ✖ aucun état financier valide trouvé")

# =========================================================
# MAIN
# =========================================================

def main():
    for company_dir in ROOT.iterdir():
        if not company_dir.is_dir():
            continue

        for year_dir in company_dir.iterdir():
            if year_dir.is_dir():
                process_year_folder(year_dir)

if __name__ == "__main__":
    main()
