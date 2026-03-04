import { NextResponse } from "next/server";
import { listCompaniesForMomoIA } from "@/lib/data/companies";

export async function GET() {
  const companies = await listCompaniesForMomoIA();
  return NextResponse.json({ companies });
}
