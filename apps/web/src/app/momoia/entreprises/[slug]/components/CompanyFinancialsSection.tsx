import type { Language } from "@/components/i18n";
import type { CompanyMetricCard } from "../types";
import { formatCompanyMetricsDate } from "../utils";

type CompanyFinancialsSectionProps = {
  eyebrow: string;
  title: string;
  asOfLabel: string;
  latestMetricsAsOf: Date | null;
  financialCards: CompanyMetricCard[];
  language: Language;
};

export function CompanyFinancialsSection({
  eyebrow,
  title,
  asOfLabel,
  latestMetricsAsOf,
  financialCards,
  language,
}: CompanyFinancialsSectionProps) {
  return (
    <section className="premium-panel px-8 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl text-slate-900">{title}</h2>
        </div>
        {latestMetricsAsOf ? (
          <p className="text-sm text-slate-500">
            {asOfLabel}: {formatCompanyMetricsDate(latestMetricsAsOf, language)}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {financialCards.map((financialCard) => (
          <article
            key={financialCard.label}
            className="rounded-[1.5rem] border border-[rgba(120,105,85,0.18)] bg-white/70 p-5"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              {financialCard.label}
            </p>
            <p className="mt-3 font-display text-2xl text-slate-900">
              {financialCard.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
