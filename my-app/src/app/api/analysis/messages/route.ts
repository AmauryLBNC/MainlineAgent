import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { getAppAuthSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";
import {
  createAnalysisMessage,
  listAnalysisMessages,
} from "@/lib/data/analysis";

export async function GET() {
  const session = await getAppAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !hasPermission(session.user.permissions, PERMISSIONS.READ_ANALYSIS_MESSAGE)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await listAnalysisMessages(session.user.id);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const session = await getAppAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !hasPermission(
      session.user.permissions,
      PERMISSIONS.CREATE_ANALYSIS_MESSAGE
    )
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    promptText?: unknown;
    responseText?: unknown;
    keywords?: unknown;
  };

  const promptText =
    typeof body.promptText === "string" ? body.promptText.trim() : "";
  const responseText =
    typeof body.responseText === "string" ? body.responseText.trim() : "";
  const keywords =
    typeof body.keywords === "string" ? body.keywords.trim() : "";

  if (!promptText || !responseText || !keywords) {
    return NextResponse.json(
      {
        error: "promptText, responseText, and keywords are required strings",
      },
      { status: 400 }
    );
  }

  const message = await createAnalysisMessage({
    userId: session.user.id,
    promptText,
    responseText,
    keywords,
  });

  return NextResponse.json({ message }, { status: 201 });
}
