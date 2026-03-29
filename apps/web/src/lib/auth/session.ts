import type { GetServerSidePropsContext } from "next";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import { hasPermission } from "@/lib/auth/rbac";
import type { PermissionName } from "@/lib/auth/permissions";

type RedirectResult = {
  redirect: {
    destination: string;
    permanent: false;
  };
};

export async function getServerAuthSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return getServerSession(req, res, authOptions);
}

export async function getAppAuthSession() {
  return getServerSession(authOptions);
}

function buildLoginRedirect(destination: string): RedirectResult {
  return {
    redirect: {
      destination: `/login?callbackUrl=${encodeURIComponent(destination)}`,
      permanent: false,
    },
  };
}

export async function requirePageAuth(
  context: GetServerSidePropsContext,
  permission?: PermissionName
): Promise<RedirectResult | { session: Session }> {
  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return buildLoginRedirect(context.resolvedUrl);
  }

  if (permission && !hasPermission(session.user.permissions, permission)) {
    return {
      redirect: {
        destination: "/403",
        permanent: false,
      },
    };
  }

  return { session };
}

export async function requireApiAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  permission?: PermissionName
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  if (permission && !hasPermission(session.user.permissions, permission)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return session;
}

export async function requireAppAuth(
  permission?: PermissionName
): Promise<Session> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (permission && !hasPermission(session.user.permissions, permission)) {
    redirect("/403");
  }

  return session;
}
