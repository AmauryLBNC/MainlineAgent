import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { bootstrapUserRoles, getUserAuthorization } from "@/lib/auth/rbac";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[next-auth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[next-auth][warn]", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[next-auth][debug]", code, metadata);
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: requiredEnv("NEXTAUTH_SECRET"),
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: requiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: requiredEnv("GITHUB_CLIENT_ID"),
      clientSecret: requiredEnv("GITHUB_CLIENT_SECRET"),
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) {
        return;
      }

      await bootstrapUserRoles(user.id, user.email);
    },
  },
  callbacks: {
    async signIn({ user }) {
      if (user.id) {
        await bootstrapUserRoles(user.id, user.email);
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      const userId = user?.id ?? token.sub;

      if (!userId) {
        return token;
      }

      if (user) {
        await bootstrapUserRoles(userId, user.email ?? token.email);
      }

      if (
        user ||
        trigger === "update" ||
        !Array.isArray(token.roles) ||
        !Array.isArray(token.permissions)
      ) {
        const authorization = await getUserAuthorization(userId);
        token.roles = authorization.roles;
        token.permissions = authorization.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.sub) {
        return session;
      }

      session.user.id = token.sub;
      session.user.roles = Array.isArray(token.roles) ? token.roles : [];
      session.user.permissions = Array.isArray(token.permissions)
        ? token.permissions
        : [];

      return session;
    },
  },
};
