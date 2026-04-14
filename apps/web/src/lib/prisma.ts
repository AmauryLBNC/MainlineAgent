import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const FALLBACK_DATABASE_URL =
  "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder";
const connectionString = process.env.DATABASE_URL ?? FALLBACK_DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
