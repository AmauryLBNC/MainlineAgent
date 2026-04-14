import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CompanyPageCompany, CompanyPageCopy } from "../types";
import { CompanyLikeButton } from "./CompanyLikeButton";

type CompanyHeroProps = {
  company: CompanyPageCompany;
  companyPageCopy: CompanyPageCopy;
  sectorLabel: string;
  thesis: string;
};

export function CompanyHero({
  company,
  companyPageCopy,
  sectorLabel,
  thesis,
}: CompanyHeroProps) {
  return (
    <Card className="app-panel rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {companyPageCopy.eyebrow}
            </Badge>
            <CardTitle className="app-title text-4xl sm:text-5xl">
              {company.name}
            </CardTitle>
            <p className="app-copy max-w-3xl text-sm leading-7 sm:text-lg">
              {thesis}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {companyPageCopy.sector}: {sectorLabel}
              </Badge>
              {company.ticker ? (
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {companyPageCopy.ticker}: {company.ticker}
                </Badge>
              ) : null}
              {company.country ? (
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {companyPageCopy.country}: {company.country}
                </Badge>
              ) : null}
            </div>
          </div>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/momoia">{companyPageCopy.backToMomoia}</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
        <CompanyLikeButton
          slug={company.slug}
          initialLiked={company.isLiked}
          initialLikesCount={company.likesCount}
          addLabel={companyPageCopy.addToLikes}
          removeLabel={companyPageCopy.removeFromLikes}
          likesLabel={companyPageCopy.likes}
          loginLabel={companyPageCopy.loginToLike}
        />
      </CardContent>
    </Card>
  );
}
