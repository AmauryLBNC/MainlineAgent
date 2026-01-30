import pandas as pd
import numpy as np
from pathlib import Path
import re

ROOT = Path("data/sec_10k")

# =========================================================
# OUTILS GÉNÉRIQUES
# =========================================================

def normalize_label(x) -> str:
    if pd.isna(x):
        return ""
    x = str(x).lower().strip()
    x = re.sub(r"\s+", " ", x)
    return x


def parse_number(x):
    if pd.isna(x):
        return np.nan

    x = str(x).strip()

    if x in {"", "-", "—"}:
        return np.nan

    # (123) -> -123
    if x.startswith("(") and x.endswith(")"):
        x = "-" + x[1:-1]

    x = x.replace("$", "").replace(",", "")

    try:
        return float(x)
    except:
        return np.nan


# =========================================================
# NETTOYAGE STRUCTUREL
# =========================================================

def clean_structure(df: pd.DataFrame) -> pd.DataFrame:
    # supprimer colonnes vides
    df = df.dropna(axis=1, how="all")

    # supprimer colonnes dupliquées
    df = df.loc[:, ~df.columns.duplicated()]

    # renommer première colonne
    df = df.rename(columns={df.columns[0]: "label"})

    # normaliser labels
    df["label"] = df["label"].apply(normalize_label)

    return df


def clean_numbers(df: pd.DataFrame) -> pd.DataFrame:
    for col in df.columns[1:]:
        df[col] = df[col].apply(parse_number)
    return df


# =========================================================
# FILTRES PAR TYPE DE TABLE
# =========================================================

def filter_cashflow(df: pd.DataFrame) -> pd.DataFrame:
    keep = {
        "net cash provided by operating activities",
        "net cash used in investing activities",
        "net cash used in financing activities",
    }
    return df[df["label"].isin(keep)]


def filter_income(df: pd.DataFrame) -> pd.DataFrame:
    keep_keywords = [
        "total revenue",
        "net sales",
        "revenue",
        "net income",
        "net loss",
    ]

    return df[df["label"].apply(
        lambda x: any(k in x for k in keep_keywords)
    )]


def filter_shares(df: pd.DataFrame) -> pd.DataFrame:
    keep_keywords = [
        "shares outstanding",
        "common stock",
    ]

    return df[df["label"].apply(
        lambda x: any(k in x for k in keep_keywords)
    )]


# =========================================================
# PIPELINE PAR DOSSIER <YEAR>
# =========================================================

def process_year_folder(year_dir: Path):
    mapping = {
        "cashflow": "cashflow_statement.csv",
        "income": "income_statement.csv",
        "shares": "shares_outstanding.csv",
    }

    for kind, filename in mapping.items():
        file = year_dir / filename
        if not file.exists():
            continue

        print(f"[CLEAN] {file}")

        df = pd.read_csv(file)

        # ordre IMPORTANT
        df = clean_structure(df)
        df = clean_numbers(df)

        if kind == "cashflow":
            df = filter_cashflow(df)
        elif kind == "income":
            df = filter_income(df)
        elif kind == "shares":
            df = filter_shares(df)

        if df.empty:
            print(f"  ⚠ {kind} vide après nettoyage")
            continue

        out = year_dir / f"{kind}_clean.csv"
        df.to_csv(out, index=False)
        print(f"  ✔ écrit → {out.name}")


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
