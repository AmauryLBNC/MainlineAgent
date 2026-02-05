recuperer un max de donnée il faut par donnée au moins dix source differente 
que l on test faire un mini site web ou pour chaque boite et chaque donnée  
demandée on récupère les valeurs de dix sites différents 


pour les données il faut que cela prenne en compte les splits et les dividendes ils sont retire des prix passe pour faire comprendre que le prix de l action n est pas le meme avant et apres la venue du dividende

### Alpha vantage parameters
https://www.alphavantage.co/documentation/
100 tickets par jour principal default une recherche un ticket
peut etre utiliser dans a peu pres tout les languages la doc en propose certains premache mais cela se toruve dans d autre language sur les forums

intraday utile pour afficher la valeur du jour
monthly utile pour faire le xgboost

#### Intraday
function required
permet de choisir le type de time series que l on veut 
par exemple :
function = TIME_SERIES_INTRADAY

symbol required
le nom de l aciton
par exemple : 
symbol = IBM

interval required 
temps entre deux donnée valeurs possible 1min, 5min, 15min, 30 min, 60min

adjusted optionnal
permet de choir si on veut le cours de bourse en prenant en compte les splits et les dividendes ou pas
par exemple 
adjusted = false


month 
permet de recuperer l intraday d un mois d une action au cours des 20 dernieres années
par exemple 
month = 1009-01

outputsize
retourne par default les 100 dernieres data de la bourse et peux jusqu a tout le moi avec le mode full qui peut etre combinée avec l option month
par exemple 
outpusize=full

datatype
par default c est un json mais csv aussi accepter 

#### Monthly

si lon veut sans adjusted on enleve _ADJUSTED

function required
permet de choisir le type de time series que l on veut 
par exemple :
function = TIME_SERIES_MONTHLY_ADJUSTED

symbol required
le nom de l aciton
par exemple : 
symbol = IBM





Alpha Vantage 
Finnhub
MarketStack
Twelve Data 
StockData.org
StockProceApi
FinancialModeling
EODHD
Yahoo Finance

scrapping a faire
advfn 
simply wall st
fx empire
seeking alpha
abc bourse historique


api et données news financières gratuites

marketaus
perplexity

#### Search Endpoint
permet de convertir un nom into un ticker aide pour faire une search bar avec autocompletion

function required
par example
function = SYMBOL_SEARCH

keywords required 
par exemple
keyword= microsoft

datatype
par default c est un json mais csv aussi accepter 

#### Market News & Sentiment

permet d avoir les articles concernant ton entreprise et permet aussi de faire en sorte de rechercher precisement des types d articles avec plusieurs entreprise mis en lien et au aussi relier ton entreprise a des sujets

function required 
par exemple :
function = NEWs_SENTIMENT

tickers optionnal
peut choisir l aciton la crypto ou la devise de otn choix pour avoir les articles que tu veux dessus
par exemple :
tickers = ibm || tickers=COIN,CRYPTO:BTC,FOREX:USD
recherche des articles ayant comme sujet coinbase le bitcoin et le usdollar

topics optionnal
permet de choisir un filtre sujet pour filtrer le sujet dont tu veux avoir
sujet accepté :blockchain,earnings,ipo,mergers_and_acquisitions,financial_markets,economy_fiscal,economy_monetary,economy_macro,energy_transportation,finance,life_sciences,manufacturing,real_estate,retail_wholesale,technology

time_from and time_to optionnal
cette option permet de mettre des barrieres entre lesquelles le sarticles sont recherchés.
par exemple : 
time_from=20220410T0130

sort optionnal
par dfeault sort lastet mais on peut le faire a l envers
par exemple sort=EARLIEST

limit optionnal
par default liimit = 50 mais on peut aussi pousser jusqu a 1000


#### earnings call transcript

function required
par exemple :
function= EARNINGS_CALL_TRANSCRIPT

symbol required
par exemple :
symbol = IBM

quarter required
for example
quarter = 2024Q1


#### Insider Transaciton
permet d avoir acces au transaction des personnes ayant acces a des infos pivilegie dans la boite par exemple actionnaire majoritaire et ceo personnes influente dans la boite.

function required
par exemple 
funciton = INSIDER_TRANSACTIONS

symbol required
par exemple : 
symbol = IBM
####  Compnay overview
cela donne les informations clee donnee pour une api comme les ratios financiers

function required
function=OVERVIEW

symbol required
symbol = IBM


####  Income statement
recupere le income statement doc

function required
function=INCOME_STATEMENT

symbol required
symbol = IBM

#### balance sheet

recupere le balance sheet doc

function required
function=BALANCE_SHEET

symbol required
symbol = IBM

#### cash flow

recupere le cash flow doc

function required
function=CASH_FLOW

symbol required
symbol = IBM

#### Earning history

recupere le Earning history doc

function required
function=EARNINGS

symbol required
symbol = IBM

### FinnHub

beaucoup de choses sont prenium dans l api donc pas beaucoup de chose exclusivement us et tout est en python surement changeable doncc api python on verra
il y a aussi surmenet des quotas
https://finnhub.io/docs/api/market-status
https://www.kaggle.com/datasets/finnhub/reported-financials

##### Symbol Lookup 
permet de entrer name isin or cusip et cela retourne les 4
#### stock symbol 
juste pour avoir le symbole 
#### Basic Financials
avoir les basique financier d une entrprise
#### Insider Transactions
avoir les transactions en insights
#### Financials As Reported 
avoir le financial comme rapprot
#### Company Profile 2 
avoir les principales info phone capital tickers webiste logo finnhubindustry 
### MarketStack
Top a regarder surtout API Endpoint v2
https://docs.apilayer.com/marketstack/docs/marketstack-api-v2-v-2-0-0?utm_source=MarketstackHomePage&utm_medium=Referral#/End-of-day/get_eod