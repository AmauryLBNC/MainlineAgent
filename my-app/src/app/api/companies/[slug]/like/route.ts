import { NextResponse } from "next/server";
import { getAppAuthSession } from "@/lib/auth/session";
import { toggleCompanyPageLike } from "@/app/momoia/entreprises/[slug]/actions";

type LikeRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(_: Request, { params }: LikeRouteProps) {
  const session = await getAppAuthSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const result = await toggleCompanyPageLike(session.user.id, slug);

  if (!result) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
