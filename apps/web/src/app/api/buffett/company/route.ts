import { NextRequest, NextResponse } from "next/server";
import {
  fromBuffettCompanyLookupResponse,
  getBuffettApiBaseUrl,
  type BuffettCompanyLookupResult,
} from "@/lib/buffett-api";
import { getYahooFinanceCompanyProfile } from "@/lib/yahoo-finance";

export const runtime = "nodejs";

async function getBackendCompanyProfile(
  symbol: string
): Promise<BuffettCompanyLookupResult | null> {
  try {
    const response = await fetch(
      `${getBuffettApiBaseUrl()}/company?symbol=${encodeURIComponent(symbol)}`,
      {
        cache: "no-store",
      }
    );
    const payload = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!response.ok || !payload) {
      return null;
    }

    return fromBuffettCompanyLookupResponse(payload);
  } catch {
    return null;
  }
}

function mergeCompanyProfiles(
  primary: BuffettCompanyLookupResult,
  enrichment: BuffettCompanyLookupResult | null
) {
  if (!enrichment) {
    return primary;
  }

  const mergedPayload = Object.fromEntries(
    Object.entries(enrichment).filter(([, value]) => value !== null && value !== "")
  ) as Partial<BuffettCompanyLookupResult>;

  return {
    ...primary,
    ...mergedPayload,
    source:
      enrichment.source && enrichment.source !== primary.source
        ? `${primary.source}+${enrichment.source}`
        : primary.source,
  } satisfies BuffettCompanyLookupResult;
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol")?.trim() ?? "";

  if (!symbol) {
    return NextResponse.json(
      {
        error: "Le ticker Yahoo Finance est obligatoire.",
      },
      { status: 400 }
    );
  }

  const [publicProfileResult, backendProfileResult] = await Promise.allSettled([
    getYahooFinanceCompanyProfile(symbol),
    getBackendCompanyProfile(symbol),
  ]);

  const publicProfile =
    publicProfileResult.status === "fulfilled" ? publicProfileResult.value : null;
  const backendProfile =
    backendProfileResult.status === "fulfilled" ? backendProfileResult.value : null;

  if (!publicProfile && !backendProfile) {
    return NextResponse.json(
      {
        error:
          "Yahoo Finance n'a pas renvoye les informations de cette entreprise.",
      },
      { status: 502 }
    );
  }

  const baseProfile = publicProfile ?? backendProfile;

  if (!baseProfile) {
    return NextResponse.json(
      {
        error:
          "Yahoo Finance n'a pas renvoye les informations de cette entreprise.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(mergeCompanyProfiles(baseProfile, backendProfile));
}
