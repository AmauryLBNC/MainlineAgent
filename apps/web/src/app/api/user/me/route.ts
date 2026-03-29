import { NextResponse } from "next/server";
import { getAppAuthSession } from "@/lib/auth/session";
import { getUserSnapshot } from "@/lib/data/users";

export async function GET() {
  const session = await getAppAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserSnapshot(session.user.id);
  return NextResponse.json({ user });
}
