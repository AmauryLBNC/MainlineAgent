import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="app-panel rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-4">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {eyebrow}
            </Badge>
            <CardTitle className="app-title text-2xl sm:text-3xl">
              {title}
            </CardTitle>
          </div>
          {latestMetricsAsOf ? (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {asOfLabel}: {formatCompanyMetricsDate(latestMetricsAsOf, language)}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8 xl:grid-cols-4">
        {financialCards.map((financialCard) => (
          <div key={financialCard.label} className="app-metric rounded-2xl px-4 py-4">
            <p className="app-kicker">{financialCard.label}</p>
            <p className="mt-3 text-xl font-semibold text-foreground">
              {financialCard.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
