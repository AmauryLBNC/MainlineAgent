import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAppAuthSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import { getUsersWithRoles } from "@/lib/data/users";

export async function GET() {
  const session = await getAppAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.permissions, PERMISSIONS.ACCESS_ADMIN)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getUsersWithRoles();
  return NextResponse.json({ users });
}
