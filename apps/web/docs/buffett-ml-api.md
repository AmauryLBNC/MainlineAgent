# Buffett ML API

Ce module ajoute un backend Python autonome qui :

- lit les entreprises et leurs metriques depuis PostgreSQL
- recherche des societes via Yahoo Finance avec autocompletion
- recupere automatiquement les fondamentaux d'un ticker Yahoo Finance
- applique des criteres inspirs de Warren Buffett
- entraine un `RandomForestRegressor`
- expose une API HTTP pour classer les entreprises ou tester de nouvelles donnees

## Fichiers

- package Python : `buffett_api/`
- labels d'entrainement : `buffett_api/data/company_labels.json`
- exemple de payload : `buffett_api/examples/manual_company.json`
- dependances Python : `requirements-buffett.txt`

## Criteres Buffett utilises

Le score combine 5 blocs :

1. `profitability` : marge nette, marge EBITDA et rendement des fonds propres
2. `cash_generation` : marge de free cash-flow et conversion du resultat en cash
3. `balance_sheet` : dette / EBITDA, dette / free cash-flow et dette / fonds propres
4. `valuation` : PE ratio et earnings yield
5. `durability` : gouvernance, social, environnement et stabilite sectorielle

Les entreprises seedees recoivent aussi une note manuelle dans `company_labels.json` pour servir d'ancrage au modele.
Comme la base initiale contient peu de lignes, le pipeline genere aussi des variantes synthetiques autour de ces exemples afin de stabiliser l'entrainement du Random Forest.

## Installation

Depuis `apps/web` :

```bash
docker compose up -d
npm run prisma:generate
npx prisma db push
npm run prisma:seed
python -m pip install -r requirements-buffett.txt
```

Variable de base attendue :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mainline_agent?schema=public
```

## Entrainer le modele

```bash
npm run buffett:train
```

Le modele entraine est ecrit dans `buffett_api/artifacts/`.

## Lancer l'API

```bash
npm run buffett:api
```

API par defaut : `http://127.0.0.1:8010`

## Endpoints

### `GET /health`

Verification simple du serveur.

### `POST /train`

Force un re-entrainement a partir de PostgreSQL.

### `GET /companies/scores`

Retourne les entreprises de la base triees par score Buffett predit.

Exemple :

```bash
curl http://127.0.0.1:8010/companies/scores
```

### `POST /score`

Score une nouvelle entreprise sans l'inserer en base.

Exemple :

```bash
curl -X POST http://127.0.0.1:8010/score \
  -H "Content-Type: application/json" \
  -d @buffett_api/examples/manual_company.json
```

Reponse typique :

```json
{
  "name": "Delta Holdings",
  "score": 84.72,
  "tier": "solide",
  "heuristic_score": 83.64,
  "component_scores": {
    "profitability": 82.32,
    "cash_generation": 85.41,
    "balance_sheet": 87.14,
    "valuation": 76.37,
    "durability": 84.2
  }
}
```

### `GET /search?query=apple`

Retourne des suggestions d'entreprises issues de Yahoo Finance.

### `GET /company?symbol=AAPL`

Retourne un profil entreprise avec fundamentals pre-remplis depuis Yahoo Finance, incluant notamment :

- `revenue`
- `net_income`
- `debt`
- `shareholders_equity`
- `free_cash_flow`
- `ebitda`
- `pe_ratio`
- `net_margin`

## Tests

Tests Python :

```bash
npm run buffett:test
```

Ils couvrent :

- le calcul du score Buffett
- le comportement de l'API `/score`
- le tri renvoye par `/companies/scores`

## Integration MomoIA

La page `MomoIA` appelle maintenant trois routes proxy Next.js :

- `GET /api/buffett/search`
- `GET /api/buffett/company`
- `POST /api/buffett/score`

Ces routes :

1. recherchent un ticker Yahoo Finance avec autocompletion
2. recuperent les fundamentals publics et pre-remplissent le formulaire
3. valident les champs saisis dans l'UI
4. appellent le backend Python sur `BUFFETT_API_URL` si cette variable est definie
5. utilisent sinon `http://127.0.0.1:8010`
6. renvoient une reponse normalisee au front

Pour tester l'integration complete depuis l'application web :

```bash
npm run buffett:api
npm run dev
```

## Limites actuelles

- le modele est pertinent pour une demo et du prototypage, pas pour un usage de gestion reelle
- la qualite du Random Forest depend fortement du volume et de la diversite de la base
- les labels manuels sont actuellement limites aux entreprises seedees
