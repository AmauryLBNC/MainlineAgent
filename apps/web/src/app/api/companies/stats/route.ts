import { NextRequest, NextResponse } from "next/server";
import {
  listCompaniesForMomoIA,
  parseCompanyCatalogSearchParams,
} from "@/lib/data/companies";

export async function GET(request: NextRequest) {
  const filters = parseCompanyCatalogSearchParams(request.nextUrl.searchParams);
  const { meta } = await listCompaniesForMomoIA({
    ...filters,
    page: 1,
    limit: 1,
  });

  return NextResponse.json({ meta });
}
