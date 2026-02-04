recuperer un max de donnée il faut par donnée au moins dix source differente 
que l on test faire un mini site web ou pour chaque boite et chaque donnée  
demandée on récupère les valeurs de dix sites différents 


pour les données il faut que cela prenne en compte les splits et les dividendes ils sont retire des prix passe pour faire comprendre que le prix de l action n est pas le meme avant et apres la venue du dividende

### Alpha vantage parameters

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