import { NextRequest, NextResponse } from "next/server";
import { searchYahooFinanceCompanies } from "@/lib/yahoo-finance";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({
      query,
      companies: [],
    });
  }

  try {
    return NextResponse.json({
      query,
      companies: await searchYahooFinanceCompanies(query),
    });
  } catch {
    return NextResponse.json(
      {
        error: "Yahoo Finance n'a pas renvoye de resultats exploitables.",
      },
      { status: 502 }
    );
  }
}
