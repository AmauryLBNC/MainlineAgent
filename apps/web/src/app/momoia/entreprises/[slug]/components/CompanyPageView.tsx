import PageShell from "@/components/Base/PageShell";
import {
  buildCompanyFinancialCards,
  getCompanySectorLabel,
  getLocalizedCompanyContent,
} from "../utils";
import type { CompanyPageViewProps } from "../types";
import { CompanyBulletListSection } from "./CompanyBulletListSection";
import { CompanyFinancialsSection } from "./CompanyFinancialsSection";
import { CompanyHero } from "./CompanyHero";
import { CompanyLeadershipSection } from "./CompanyLeadershipSection";
import { CompanyPresentationSection } from "./CompanyPresentationSection";

export function CompanyPageView({
  company,
  companyPageCopy,
  sectorOptions,
  language,
}: CompanyPageViewProps) {
  const localizedCompanyContent = getLocalizedCompanyContent(
    company.metadata,
    language
  );
  const sectorLabel = getCompanySectorLabel(company.sector, sectorOptions);
  const financialCards = buildCompanyFinancialCards(
    company.latestMetrics,
    companyPageCopy.metrics,
    language
  );

  return (
    <PageShell align="start" density={24}>
      <div className="w-full py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <CompanyHero
            company={company}
            companyPageCopy={companyPageCopy}
            sectorLabel={sectorLabel}
            thesis={localizedCompanyContent.thesis}
          />

          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <CompanyPresentationSection
              eyebrow={companyPageCopy.presentationEyebrow}
              title={companyPageCopy.presentationTitle}
              investmentCaseTitle={companyPageCopy.investmentCase}
              overviewParagraphs={localizedCompanyContent.overview}
              investmentCasePoints={localizedCompanyContent.investmentCase}
            />

            <CompanyLeadershipSection
              eyebrow={companyPageCopy.leadershipEyebrow}
              leaderName={company.metadata.leadership.name}
              leaderRole={localizedCompanyContent.leadershipRole}
              biographyParagraphs={localizedCompanyContent.leadershipBiography}
              highlightPoints={localizedCompanyContent.leadershipHighlights}
              websiteUrl={company.website}
              websiteLabel={companyPageCopy.website}
            />
          </section>

          <CompanyFinancialsSection
            eyebrow={companyPageCopy.financialsEyebrow}
            title={companyPageCopy.financialsTitle}
            asOfLabel={companyPageCopy.metrics.asOf}
            latestMetricsAsOf={company.latestMetrics?.asOf ?? null}
            financialCards={financialCards}
            language={language}
          />

          <section className="grid gap-6 lg:grid-cols-2">
            <CompanyBulletListSection
              eyebrow={companyPageCopy.strengthsEyebrow}
              title={companyPageCopy.strengthsTitle}
              items={localizedCompanyContent.strengths}
            />
            <CompanyBulletListSection
              eyebrow={companyPageCopy.weaknessesEyebrow}
              title={companyPageCopy.weaknessesTitle}
              items={localizedCompanyContent.weaknesses}
            />
          </section>
        </div>
      </div>
    </PageShell>
  );
}
