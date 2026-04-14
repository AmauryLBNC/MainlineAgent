import { NextRequest, NextResponse } from "next/server";
import {
  listCompaniesForMomoIA,
  parseCompanyCatalogSearchParams,
} from "@/lib/data/companies";

export async function GET(request: NextRequest) {
  const filters = parseCompanyCatalogSearchParams(request.nextUrl.searchParams);
  const result = await listCompaniesForMomoIA(filters);
  return NextResponse.json(result);
}
