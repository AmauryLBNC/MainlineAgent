import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Analyse entreprises")

df = pd.read_csv("fake_dataset_companies.csv")

st.write("Aperçu des données")
st.dataframe(df)

colonne = st.selectbox("Choisir une colonne", df.columns)

fig = px.histogram(df, x=colonne)
st.plotly_chart(fig)

st.write("Statistiques descriptives")
st.write(df.describe())