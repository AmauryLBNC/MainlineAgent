from yahooquery import Ticker
import pandas as pd

ticker = "AAPL"  # change par COH.PA si disponible
t = Ticker(ticker)
import requests
from requests_oauthlib import OAuth2Session

# ---- METS TES NOUVELLES CLES ICI ----
CLIENT_ID = "dj0yJmk9Nk9ycXc4U0NMY0tSJmQ9WVdrOVIwSXlhVVoyU20wbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTgy"
CLIENT_SECRET = "8de8f0190fd4f42a3b1759f0482d8e2e89d90862"
REDIRECT_URI = "http://localhost:8000/callback"  # ⚠️ pas de https

AUTH_URL = "https://api.login.yahoo.com/oauth2/request_auth"
TOKEN_URL = "https://api.login.yahoo.com/oauth2/get_token"

oauth = OAuth2Session(
    CLIENT_ID,
    redirect_uri=REDIRECT_URI,
    scope=["openid", "email", "profile"]  # ⚠️ obligatoire chez Yahoo
)

auth_url, state = oauth.authorization_url(AUTH_URL)

print("\n➡️ Ouvre ce lien dans ton navigateur :\n")
print(auth_url)

redirect_response = input("\n➡️ Colle ici l’URL complète après login Yahoo :\n")

token = oauth.fetch_token(
    TOKEN_URL,
    authorization_response=redirect_response,
    client_secret=CLIENT_SECRET
)

print("\n🎉 TOKEN OBTENU !")
print(token)

response = oauth.get("https://api.login.yahoo.com/openid/v1/userinfo")
print(response.json())
