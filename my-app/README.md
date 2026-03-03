# MainlineAgent Auth + RBAC

This project now includes:

- OAuth-only authentication with `next-auth`
- Google + GitHub providers
- JWT sessions with RBAC claims embedded in the token/session
- PostgreSQL + Prisma 7
- Advanced RBAC with `Role`, `Permission`, `UserRole`, and `RolePermission`
- Protected Pages Router routes: `/dashboard`, `/profile`, `/settings`, `/admin`
- Protected API routes for admin, current user, and AI pedagogy message history
- Business tables for companies, metrics, criteria, recommendations, likes, and `AnalysisMessage`

## Stack

- Next.js `16.1.6`
- Pages Router for auth and protected pages
- Existing `src/app` routes preserved
- NextAuth.js `4.24.13`
- Prisma `7.4.1` with PostgreSQL driver adapter

## Environment

Copy `.env.example` to `.env.local` and fill the OAuth credentials:

```bash
cp .env.example .env.local
```

Required variables:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ADMIN_EMAILS` optional, comma-separated

## Local PostgreSQL

Start PostgreSQL in Docker:

```bash
docker compose up -d
```

Default database credentials from `docker-compose.yml`:

- user: `postgres`
- password: `postgres`
- database: `mainline_agent`
- port: `5432`

## Install and Run

```bash
npm install
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Application URLs:

- app: `http://localhost:3000`
- login: `http://localhost:3000/login`
- dashboard: `http://localhost:3000/dashboard`

## Prisma Commands

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

Useful direct commands:

```bash
npx prisma migrate dev
npx prisma migrate reset
npx prisma studio
```

## OAuth Setup

### Google

Create OAuth credentials in Google Cloud and configure:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub

Create an OAuth App in GitHub and configure:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## RBAC Behavior

- Every new user receives the `USER` role automatically.
- The first registered user is automatically promoted to `ADMIN`.
- Any email listed in `ADMIN_EMAILS` is also promoted to `ADMIN`.
- Authorization checks use permissions, not hardcoded role comparisons.
- `/admin` requires the `ACCESS_ADMIN` permission.

Default seeded permissions:

- `VIEW_DASHBOARD`
- `VIEW_PROFILE`
- `MANAGE_SETTINGS`
- `CREATE_ANALYSIS_MESSAGE`
- `READ_ANALYSIS_MESSAGE`
- `ACCESS_ADMIN`
- `MANAGE_USERS`

## Implemented Routes

Pages Router pages:

- `/login`
- `/dashboard`
- `/profile`
- `/settings`
- `/admin`
- `/403`

API routes:

- `/api/auth/[...nextauth]`
- `/api/admin/users`
- `/api/user/me`
- `/api/analysis/messages`

## Database Coverage

Authentication:

- `User`
- `Account`
- `Session`
- `VerificationToken`

RBAC:

- `Role`
- `Permission`
- `UserRole`
- `RolePermission`

Business:

- `Company`
- `FinancialMetrics`
- `ExtraFinancialMetrics`
- `UserLike`
- `UserCriteria`
- `RecommendationHistory`
- `AnalysisMessage`

## Verification Performed

The following checks were run locally with environment placeholders:

- `npx prisma validate`
- `npx prisma generate`
- `npm run build`

## Acceptance Checklist

- `docker compose up -d` supported
- OAuth-only login page added for Google + GitHub
- Post-login redirect targets `/dashboard`
- Protected routes redirect unauthenticated users to `/login`
- `/admin` is permission-gated
- Prisma schema and baseline migration added
- Admin API returns users with roles and permissions
- `AnalysisMessage` supports authenticated `GET` and `POST`
- `.env.example` and setup instructions are included
