# MainlineAgent

A faire a chaque fois :
docker compose up -d


Ce projet utilise maintenant :

- Next.js `16` avec `src/app`
- NextAuth.js avec OAuth uniquement
- Google + GitHub comme providers
- PostgreSQL + Prisma 7
- RBAC avec roles et permissions
- pages protegees : `/login`, `/dashboard`, `/profile`, `/settings`, `/admin`

## Avant de lancer le programme

Il faut preparer 4 choses :

1. Avoir Docker lance sur la machine
2. Avoir un fichier `.env.local`
3. Avoir cree les credentials OAuth Google et GitHub
4. Avoir initialise la base PostgreSQL

## Variables d'environnement

Copie d'abord le fichier d'exemple :

```bash
cp .env.example .env.local
```

Variables obligatoires :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mainline_agent?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
ADMIN_EMAILS="admin@example.com"
```

## Configuration OAuth

### Google

Dans Google Cloud :

- cree un OAuth Client ID
- ajoute `http://localhost:3000` comme origine autorisee
- ajoute `http://localhost:3000/api/auth/callback/google` comme URI de redirection

### GitHub

Dans GitHub OAuth Apps :

- Homepage URL : `http://localhost:3000`
- Authorization callback URL : `http://localhost:3000/api/auth/callback/github`

## Lancement local

Demarre d'abord PostgreSQL :

```bash
docker compose up -d
```

Installe ensuite les dependances :

```bash
npm install
```

Genere Prisma, applique la migration et seed les roles/permissions :

```bash
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
```

Lance enfin le projet :

```bash
npm run dev
```

## Ordre recommande complet

```bash
cp .env.example .env.local
docker compose up -d
npm install
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Verification apres demarrage

1. Ouvrir `http://localhost:3000/login`
2. Verifier que les boutons Google et GitHub apparaissent
3. Se connecter avec un compte OAuth
4. Verifier la redirection vers `/dashboard`
5. Verifier que `/profile` et `/settings` fonctionnent
6. Verifier que `/admin` est refuse sans permission
7. Verifier que `/admin` fonctionne avec un compte admin

## Comportement RBAC

- tout nouvel utilisateur recoit `USER`
- le premier utilisateur peut devenir `ADMIN`
- tout email present dans `ADMIN_EMAILS` peut devenir `ADMIN`
- l'acces admin repose sur la permission `ACCESS_ADMIN`

## Commandes utiles

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
npm run build
npm run lint
```

## Fichiers importants

- auth NextAuth : [src/lib/auth/options.ts](/home/amaury/Documents/Github/MainlineAgent/my-app/src/lib/auth/options.ts)
- guards auth : [src/lib/auth/session.ts](/home/amaury/Documents/Github/MainlineAgent/my-app/src/lib/auth/session.ts)
- middleware : [middleware.ts](/home/amaury/Documents/Github/MainlineAgent/my-app/middleware.ts)
- schema Prisma : [prisma/schema.prisma](/home/amaury/Documents/Github/MainlineAgent/my-app/prisma/schema.prisma)
- login UI : [src/app/login/page.tsx](/home/amaury/Documents/Github/MainlineAgent/my-app/src/app/login/page.tsx)
- prompt d'explication : [docs/login-auth-prompt.md](/home/amaury/Documents/Github/MainlineAgent/my-app/docs/login-auth-prompt.md)

## Prompt pret a l'emploi

Un prompt dedie est disponible ici :

- [docs/login-auth-prompt.md](/home/amaury/Documents/Github/MainlineAgent/my-app/docs/login-auth-prompt.md)

Il sert a demander a une IA :

- comment le login fonctionne
- comment brancher Google et GitHub
- quelles etapes faire avant que le systeme marche
- comment verifier que la configuration est correcte
