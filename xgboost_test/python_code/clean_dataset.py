import pandas as pd

INPUT_FILE = "xgboost_test_data_500.csv"
OUTPUT_FILE = "xgboost_clean_data.csv"

# ======================
# LOAD
# ======================
df = pd.read_csv(INPUT_FILE)

print(f"Avant nettoyage : {len(df)} lignes")

# ======================
# DROP LIGNES INCOMPLÈTES
# ======================
df_clean = df.dropna()

print(f"Après nettoyage : {len(df_clean)} lignes")

# ======================
# RESET INDEX (IMPORTANT)
# ======================
df_clean = df_clean.reset_index(drop=True)

# ======================
# EXPORT
# ======================
df_clean.to_csv(OUTPUT_FILE, index=False)

print(f"✅ Dataset nettoyé sauvegardé : {OUTPUT_FILE}")
