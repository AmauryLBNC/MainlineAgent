import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <section className="premium-panel px-8 py-10 sm:px-12 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <p className="eyebrow">{companyPageCopy.eyebrow}</p>
          <h1 className="mt-3 font-display text-3xl text-slate-900 sm:text-5xl">
            {company.name}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">{thesis}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>
              {companyPageCopy.sector}: {sectorLabel}
            </span>
            {company.ticker ? (
              <span>
                {companyPageCopy.ticker}: {company.ticker}
              </span>
            ) : null}
            {company.country ? (
              <span>
                {companyPageCopy.country}: {company.country}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3">
          <CompanyLikeButton
            slug={company.slug}
            initialLiked={company.isLiked}
            initialLikesCount={company.likesCount}
            addLabel={companyPageCopy.addToLikes}
            removeLabel={companyPageCopy.removeFromLikes}
            likesLabel={companyPageCopy.likes}
            loginLabel={companyPageCopy.loginToLike}
          />
          <Button
            asChild
            variant="outline"
            className="cta-soft shadow-none hover:shadow-none"
          >
            <Link href="/momoia">{companyPageCopy.backToMomoia}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
