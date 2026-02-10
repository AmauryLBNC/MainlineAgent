import yfinance as yf
import pandas as pd
from pprint import pprint


def get_sommaire_activite (info):
    return  info.get("longBusinessSummary",None)

def get_industry (info):
    return info.get("industry",None)
         
def get_officiers_entreprise (info):
    return info.get("companyOfficers",None)

def get_prix_actuel (info):
    return info.get("currentPrice",None)

def get_pourcentage_dividend (info):
    return info.get("dividendRate", None)

def get_dividends (yf_tickers):
    return yf_tickers.dividends

def get_secteur_activite (info):
    return  info.get("sector",None)





def get_endettement_long_terme (balance_sheet):
    if "Long Term Debt" in balance_sheet.index:
        
        endettement_long_terme_table = (
            balance_sheet.loc["Long Term Debt"] / 1e9
        ).to_frame(name="Long Term Debt")

        # Index (date) → colonne Year
        endettement_long_terme_table = endettement_long_terme_table.reset_index()
        endettement_long_terme_table.rename(columns={"index": "Year"}, inplace=True)

        # Nettoyage
        endettement_long_terme_table = (
            endettement_long_terme_table
            .dropna(subset=["Long Term Debt"])
            .reset_index(drop=True)
        )

        # Conversion Year → int
        endettement_long_terme_table["Year"] = (
            pd.to_datetime(endettement_long_terme_table["Year"], errors="coerce")
            .dt.year
            .astype(int)
        )

        return endettement_long_terme_table
    else :
        return None
def get_cagr_endettement_long_terme (endettement_long_terme_tab):
      endettement_long_terme_tab = endettement_long_terme_tab.dropna(subset=["Long Term Debt"]).reset_index(drop=True)
      year_number = endettement_long_terme_tab["Year"].iloc[0]-endettement_long_terme_tab["Year"].iloc[-1]
      revenue_final =endettement_long_terme_tab["Long Term Debt"][0]
      revenue_initial = endettement_long_terme_tab["Long Term Debt"].iloc[-1]
      cagr = ((revenue_final/revenue_initial)**(1/year_number))-1
      return cagr


def get_revenue (yf_ticker):
    # Récupération du compte de résultat annuel
    income_stmt = yf_ticker.income_stmt
    if "Total Revenue"  in income_stmt.index:
        # Le chiffre d'affaires est sous la ligne "Total Revenue"
        revenue = income_stmt.loc["Total Revenue"]
        # On prend les 4 dernières années
        revenue_4y = revenue.head(4)
        # Mise en forme dans un DataFrame propre
        revenue_tab = pd.DataFrame({
            "Year": revenue_4y.index.year,
            "Revenue_USD": revenue_4y.values
        })
        # Optionnel : convertir en milliards
        revenue_tab["Revenue"] = revenue_tab["Revenue_USD"] / 1e9
        # enlever la colonne pas en milliard
        revenue_tab = revenue_tab.drop(columns=["Revenue_USD"])
        return  (revenue_tab)
    else :
        return None

def get_cagr_revenue (revenue_tab):
      revenue_tab = revenue_tab.dropna(subset=["Revenue"]).reset_index(drop=True)
      year_number = revenue_tab["Year"].iloc[0]-revenue_tab["Year"].iloc[-1]
      revenue_final =revenue_tab["Revenue"][0]
      revenue_initial = revenue_tab["Revenue"].iloc[-1]
      cagr = ((revenue_final/revenue_initial)**(1/year_number))-1
      return cagr

def get_resultat_net(income_stmt):
    if income_stmt is None or income_stmt.empty or "Net Income" not in income_stmt.index:
        return None

    return (
        income_stmt.loc["Net Income"]
        .rename("Net Income")
        .to_frame()
        .reset_index()
        .rename(columns={"index": "Year"})
        .dropna(subset=["Net Income"])
        .assign(
            Year=lambda df: pd.to_datetime(df["Year"], errors="coerce").dt.year.astype(int),
            **{"Net Income": lambda df: df["Net Income"] / 1e9},
        )
        .reset_index(drop=True)
    )

def get_cagr_resultat_net(resultat_net_table):
    
    resultat_net_table=resultat_net_table.dropna(subset=["Net Income"]).reset_index(drop=True)
    year_number=resultat_net_table["Year"].iloc[0]-resultat_net_table["Year"].iloc[-1]
    revenue_final =resultat_net_table["Net Income"][0]
    revenue_initial = resultat_net_table["Net Income"].iloc[-1]
    cagr = ((revenue_final/revenue_initial)**(1/year_number))-1
    return cagr

def get_marge_net(income_stmt):

    if income_stmt is None or income_stmt.empty:
        return None

    required = {"Net Income", "Total Revenue"}
    if not required.issubset(income_stmt.index):
        return None

    df = income_stmt.loc[list(required)].T
    df["Net Margin"] = df["Net Income"] / df["Total Revenue"]
    df = df[["Net Margin"]].dropna()
    df["Year"]=df.index
    df["Year"] = pd.to_datetime(df["Year"], errors="coerce").dt.year.astype(int)
    df = df.reset_index(drop=True)

    return df.sort_index()
def get_cagr_marge_net(marge_net_tab):
    print(marge_net_tab)
    marge_net_tab=marge_net_tab.dropna(subset=["Net Margin"]).reset_index(drop=True)
    year_number=marge_net_tab["Year"].iloc[0]-marge_net_tab["Year"].iloc[-1]
    revenue_final =marge_net_tab["Net Margin"][0]
    revenue_initial = marge_net_tab["Net Margin"].iloc[-1]
    cagr = ((revenue_final/revenue_initial)**(1/year_number))-1
    return cagr

def get_cagr_list (table):
    if table != None :
        list_cagr=[]
        for t in table:
            list_cagr.append([t,get_cagr_revenue(get_revenue(t))])
        return list_cagr
    else :
        return None
        
def get_tresorerie(balance_sheet):
    if "Cash And Cash Equivalents" in balance_sheet.index:
        tresorerie = balance_sheet.loc["Cash And Cash Equivalents"] / 1e9
        tresorerie = tresorerie.dropna()
        return tresorerie
    else :
        return None

def get_per(info):
    return info.get("trailingPE",None)


sp500_tickers = [
# Mega / Large Caps
"AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "META", "NVDA", "BRK-B", "TSLA", "UNH",

# Tech & Software
"ADBE", "CRM", "ORCL", "INTU", "IBM", "NOW", "CSCO", "ACN", "TXN", "QCOM",
"AMD", "INTC", "AVGO", "MU", "SNPS", "CDNS", "ANET", "PANW", "CRWD", "ZS",

# Finance
"JPM", "BAC", "WFC", "C", "GS", "MS", "BLK", "AXP", "SCHW", "SPGI",
"ICE", "CME", "PNC", "USB", "TFC",

# Healthcare
"JNJ", "PFE", "MRK", "ABBV", "LLY", "MDT", "BMY", "AMGN", "GILD", "VRTX",

# Consumer & Retail
"WMT", "COST", "HD", "LOW", "TGT", "MCD", "SBUX", "NKE", "PEP", "KO",

# Industrial & Energy
"CAT", "DE", "BA", "GE", "HON", "UPS", "RTX", "LMT", "XOM", "CVX",

# Communication / Media
"DIS", "NFLX", "CMCSA", "T", "VZ"
] 
"""for l in sp500_tickers:
    print(get_industry(l),get_officiers_entreprise(l),get_dividends(l),get_pourcentage_dividend(l),get_secteur_activite(l),get_sommaire_activite(l),get_industry(l))
"""


for l in sp500_tickers:
    yfinance_ticker=yf.Ticker(l)
    info=yfinance_ticker.info
    income_statement=yfinance_ticker.income_stmt
    balance_sheet=yfinance_ticker.balance_sheet
    print(l)
    print("marge net : ")
    pprint(get_cagr_marge_net(get_marge_net(income_statement)))
    print("endettement long therme : ")
    pprint(get_cagr_endettement_long_terme(get_endettement_long_terme (balance_sheet)))
    print("resultat net : ")
    pprint(get_cagr_resultat_net(get_resultat_net(income_statement)))
    print("revenue : ")
    pprint(get_cagr_revenue(get_revenue(yfinance_ticker)))
    