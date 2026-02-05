import streamlit as st
import pandas as pd
import random
import os
import math

# ======================
# CONFIG
# ======================
st.set_page_config(page_title="⚔️ Duel d'entreprises (Elo)", layout="wide")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_FILE = os.path.join(BASE_DIR, "xgboost_clean_data2.csv")

K_BASE = 20
ELO_MIN = 800
ELO_MAX = 3000
MATCHS_STABLE = 30   # au-delà → Elo considéré stable

# ======================
# LOAD DATA
# ======================
df = pd.read_csv(CSV_FILE)

# Initialisation Elo depuis pré-classement si besoin
if "elo" not in df.columns:
    if "target" in df.columns:
        df["elo"] = 1000 + df["target"] * 10
    else:
        df["elo"] = 1500.0

# target devient le compteur de matchs
if "target" not in df.columns:
    df["target"] = 0

# ======================
# SESSION STATE
# ======================
if "duel" not in st.session_state:
    st.session_state.duel = None

# ======================
# ELO FUNCTIONS
# ======================
def expected_score(ra, rb):
    return 1 / (1 + 10 ** ((rb - ra) / 400))

def k_factor(matches):
    # Plus une entreprise a de matchs, plus l'Elo est stable
    return max(5, K_BASE * math.exp(-matches / MATCHS_STABLE))

def update_elo(idx_win, idx_lose):
    ra = df.loc[idx_win, "elo"]
    rb = df.loc[idx_lose, "elo"]

    ea = expected_score(ra, rb)
    eb = expected_score(rb, ra)

    ka = k_factor(df.loc[idx_win, "target"])
    kb = k_factor(df.loc[idx_lose, "target"])

    df.loc[idx_win, "elo"] = ra + ka * (1 - ea)
    df.loc[idx_lose, "elo"] = rb + kb * (0 - eb)

    # Incrément du nombre de matchs
    df.loc[idx_win, "target"] += 1
    df.loc[idx_lose, "target"] += 1

    df["elo"] = df["elo"].clip(ELO_MIN, ELO_MAX)

    df.to_csv(CSV_FILE, index=False)

# ======================
# DUEL SELECTION
# ======================
def generate_duel():
    # Priorité aux entreprises peu comparées
    weights = 1 / (1 + df["target"])
    idx1 = random.choices(df.index.tolist(), weights=weights, k=1)[0]

    elo1 = df.loc[idx1, "elo"]

    # adversaires proches en Elo
    candidates = df[
        (abs(df["elo"] - elo1) <= 120) & (df.index != idx1)
    ]

    if len(candidates) == 0:
        return None

    idx2 = random.choice(candidates.index.tolist())
    return idx1, idx2

# ======================
# INIT DUEL
# ======================
if st.session_state.duel is None:
    st.session_state.duel = generate_duel()

if st.session_state.duel is None:
    st.error("Pas assez d'entreprises comparables.")
    st.stop()

idx1, idx2 = st.session_state.duel
row1 = df.loc[idx1]
row2 = df.loc[idx2]

# ======================
# DISPLAY
# ======================
left, right = st.columns([3, 1])

with left:
    st.subheader("⚔️ Duel Elo")

    col1, col2 = st.columns(2)

    def show_company(col, row):
        col.markdown(f"### {row['ticker']}")
        col.write(f"Elo : **{int(row['elo'])}**")
        col.write(f"Matchs joués : {int(row['target'])}")

        for c in df.columns:
            if c not in ["ticker", "elo", "target"] and pd.notna(row[c]):
                col.metric(c, f"{row[c]:,.2f}")

    show_company(col1, row1)
    show_company(col2, row2)

# ======================
# BUTTONS
# ======================
with left:
    st.markdown("### 🟦 Choix")

    b1, b2 = st.columns(2)

    with b1:
        if st.button(f"✅ {row1['ticker']} gagne"):
            update_elo(idx1, idx2)
            st.session_state.duel = generate_duel()
            st.rerun()

    with b2:
        if st.button(f"✅ {row2['ticker']} gagne"):
            update_elo(idx2, idx1)
            st.session_state.duel = generate_duel()
            st.rerun()

# ======================
# LEADERBOARD
# ======================
with right:
    st.subheader("🏆 Classement Elo")

    leaderboard = (
        df[["ticker", "elo", "target"]]
        .sort_values("elo", ascending=False)
        .head(400)
        .reset_index(drop=True)
    )

    leaderboard.index += 1
    st.table(leaderboard)
