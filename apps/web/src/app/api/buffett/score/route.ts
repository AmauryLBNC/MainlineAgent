import { NextRequest, NextResponse } from "next/server";
import {
  fromBuffettBackendResponse,
  getBuffettApiBaseUrl,
  toBuffettBackendRequest,
  validateBuffettScoreInput,
} from "@/lib/buffett-api";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const validationResult = validateBuffettScoreInput(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: validationResult.message,
        fieldErrors: validationResult.fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const backendResponse = await fetch(`${getBuffettApiBaseUrl()}/score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(toBuffettBackendRequest(validationResult.data)),
    });

    const rawPayload = (await backendResponse.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error:
            typeof rawPayload?.detail === "string"
              ? rawPayload.detail
              : "Le service Buffett a refuse l'analyse demandee.",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(fromBuffettBackendResponse(rawPayload ?? {}));
  } catch {
    return NextResponse.json(
      {
        error:
          "Le service Buffett est indisponible. Lancez `npm run buffett:api` avant de tester la notation IA.",
      },
      { status: 503 }
    );
  }
}
