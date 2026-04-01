🟢 1️⃣ Créer une base PostgreSQL
Option la plus simple (local avec Docker)

Installe Docker puis lance :

docker run --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=mainagent \
  -p 5432:5432 \
  -d postgres

docker run --name postgres-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=mainagent -p 5432:5432 -d postgres

Ta base est maintenant :

Host: localhost
Port: 5432
User: postgres
Password: 1234
Database: mainagent
🟢 2️⃣ Installer Prisma (méthode recommandée)

Dans ton projet Next.js :

npm install prisma @prisma/client
npx prisma init

Ça crée :

/prisma/schema.prisma
.env
🟢 3️⃣ Configurer la connexion

Dans .env :

DATABASE_URL="postgresql://postgres:1234@localhost:5432/mainagent"
🟢 4️⃣ Définir tes tables

Dans prisma/schema.prisma :

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Company {
  id        Int     @id @default(autoincrement())
  name      String
  sector    String
  marge     Float?
  dette     Float?
  famille   Boolean
  createdAt DateTime @default(now())
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  password  String
  createdAt DateTime @default(now())
  likes     Like[]
}

model Like {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  company   Company  @relation(fields: [companyId], references: [id])
  companyId Int
  liked     Boolean
  createdAt DateTime @default(now())
}
🟢 5️⃣ Créer la base
npx prisma migrate dev --name init

Ça :

crée les tables

génère le client Prisma

🟢 6️⃣ Connecter dans Next.js

Crée un fichier :

/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
🟢 7️⃣ Utiliser dans une API Route (App Router)

Dans :

/app/api/companies/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.company.findMany();
  return Response.json(companies);
}
🟢 8️⃣ Appel côté frontend
const res = await fetch("/api/companies");
const data = await res.json();
🟢 9️⃣ Déploiement

En production :

utilise Supabase ou Neon

mets la nouvelle DATABASE_URL

Prisma fonctionne pareil

🟢 Alternative simple sans Prisma

Si tu veux direct PostgreSQL sans ORM :

npm install pg

Puis :

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query("SELECT * FROM companies");
  return Response.json(result.rows);
}

Mais Prisma est plus propre et scalable.

🎯 Ce que je te recommande

Pour ton projet IA fintech :

✔ PostgreSQL
✔ Prisma
✔ FastAPI séparé pour moteur IA
✔ Next.js uniquement pour UI + API légère

🧠 Architecture idéale
Next.js (frontend)
      ↓
Next API (auth, users)
      ↓
PostgreSQL
      ↓
FastAPI (moteur IA scoring)

Si tu veux, je peux maintenant :

🔥 te faire un schéma complet architecture prod

🔥 t'expliquer comment connecter FastAPI à la même base

🔥 te montrer comment seed tes 5000 entreprises

🔥 te faire un guide déploiement complet

Tu veux aller vers quoi ?