import pandas as pd
import numpy as np

# ======================
# CONFIG
# ======================
INPUT_CSV = "xgboost_test/xgboost_clean_data.csv"
OUTPUT_CSV = "xgboost_test/xgboost_clean_data2.csv"

TICKER_COL = "ticker"

FEATURES = [
    "ca",
    "cagr_ca",
    "resultat_net",
    "cagr_resultat_net",
    "marge",
    "cagr_marge",
    "endettement_long_terme",
    "cagr_endettement_lt",
    "capex_sur_ca",
    "per",
]

# ======================
# LOAD DATA
# ======================
df = pd.read_csv(INPUT_CSV)

assert TICKER_COL in df.columns, "❌ Colonne ticker manquante"

for col in FEATURES:
    if col not in df.columns:
        raise ValueError(f"❌ Colonne manquante : {col}")

# 👉 On garde uniquement les colonnes utiles
df = df[[TICKER_COL] + FEATURES].copy()

# ======================
# CLEANING MINIMAL
# ======================
# (sécurité basique, sans transformer les données)

df.replace([np.inf, -np.inf], np.nan, inplace=True)

for col in FEATURES:
    df[col] = df[col].fillna(df[col].median())

# ======================
# INITIALISATION ELO & TARGET
# ======================
df["elo"] = 1500.0     # score Elo initial
df["target"] = 0       # nombre de matchs joués / confiance

# ======================
# EXPORT
# ======================
df.to_csv(OUTPUT_CSV, index=False)

print("✅ Fichier préparé sans normalisation")
print("➡️ elo initialisé à 1500")
print("➡️ target = 0 (matchs joués)")
print(f"➡️ Fichier prêt : {OUTPUT_CSV}")
