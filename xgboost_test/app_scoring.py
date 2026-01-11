import streamlit as st
import pandas as pd

# ======================
# CONFIG
# ======================
st.set_page_config(page_title="Scoring Fondamental", layout="wide")

CSV_FILE = "xgboost_test_data.csv"

# ======================
# LOAD DATA
# ======================
df = pd.read_csv(CSV_FILE)

st.title("📊 Scoring Fondamental – Édition du Target")

st.markdown("""
Cette app te permet de :
- visualiser les données financières
- attribuer une **note de 0 à 100**
- préparer un dataset propre pour XGBoost
""")

# ======================
# SELECT COMPANY
# ======================
ticker = st.selectbox(
    "Choisir une entreprise",
    df["ticker"].unique()
)

row_idx = df[df["ticker"] == ticker].index[0]
row = df.loc[row_idx]

# ======================
# DISPLAY DATA
# ======================
st.subheader(f"📌 Données financières – {ticker}")

cols = st.columns(3)
i = 0
for col in row.index:
    if col not in ["ticker", "target"] and not pd.isna(row[col]):
        cols[i % 3].metric(col, f"{row[col]:,.2f}")
        i += 1

# ======================
# SCORE EDITOR
# ======================
st.subheader("🎯 Score fondamental (0 – 100)")

new_score = st.slider(
    "Modifier la note",
    min_value=0,
    max_value=100,
    value=int(row["target"])
)

# ======================
# SAVE
# ======================
if st.button("💾 Sauvegarder le score"):
    df.loc[row_idx, "target"] = new_score
    df.to_csv(CSV_FILE, index=False)
    st.success("Score sauvegardé avec succès ✔️")

# ======================
# TABLE VIEW
# ======================
with st.expander("📄 Voir tout le dataset"):
    st.dataframe(df)
