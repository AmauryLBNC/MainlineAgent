import type { Language } from "@/components/i18n";
import type {
  CompanyLatestFinancialMetrics,
  CompanyLocalizedContent,
  CompanyMetricCard,
  CompanyPageCopy,
  CompanyProfileMetadata,
  LocalizedText,
  LocalizedTextList,
  StepOption,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getLocalizedText(
  value: unknown,
  fallbackFr: string,
  fallbackEn: string
): LocalizedText {
  if (!isRecord(value)) {
    return { fr: fallbackFr, en: fallbackEn };
  }

  return {
    fr: typeof value.fr === "string" ? value.fr : fallbackFr,
    en: typeof value.en === "string" ? value.en : fallbackEn,
  };
}

function getLocalizedTextList(
  value: unknown,
  fallbackFr: string[] = [],
  fallbackEn: string[] = []
): LocalizedTextList {
  if (!isRecord(value)) {
    return { fr: fallbackFr, en: fallbackEn };
  }

  return {
    fr: Array.isArray(value.fr)
      ? value.fr.filter((entry): entry is string => typeof entry === "string")
      : fallbackFr,
    en: Array.isArray(value.en)
      ? value.en.filter((entry): entry is string => typeof entry === "string")
      : fallbackEn,
  };
}

export function getCompanyProfileMetadata(
  metadata: unknown
): CompanyProfileMetadata {
  const companyMetadataRecord = isRecord(metadata) ? metadata : {};
  const leadershipRecord = isRecord(companyMetadataRecord.leadership)
    ? companyMetadataRecord.leadership
    : undefined;

  return {
    thesis: getLocalizedText(
      companyMetadataRecord.thesis,
      "Entreprise de qualite avec visibilite long terme.",
      "Quality company with strong long-term visibility."
    ),
    overview: getLocalizedTextList(companyMetadataRecord.overview),
    strengths: getLocalizedTextList(companyMetadataRecord.strengths),
    weaknesses: getLocalizedTextList(companyMetadataRecord.weaknesses),
    investmentCase: getLocalizedTextList(companyMetadataRecord.investmentCase),
    leadership: {
      name:
        leadershipRecord && typeof leadershipRecord.name === "string"
          ? leadershipRecord.name
          : "Unknown leader",
      role: getLocalizedText(
        leadershipRecord?.role,
        "Direction generale",
        "Executive leadership"
      ),
      biography: getLocalizedTextList(leadershipRecord?.biography),
      highlights: getLocalizedTextList(leadershipRecord?.highlights),
    },
  };
}

export function toNullableNumber(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function getLocalizedCompanyContent(
  metadata: CompanyProfileMetadata,
  language: Language
): CompanyLocalizedContent {
  if (language === "fr") {
    return {
      thesis: metadata.thesis.fr,
      overview: metadata.overview.fr,
      investmentCase: metadata.investmentCase.fr,
      strengths: metadata.strengths.fr,
      weaknesses: metadata.weaknesses.fr,
      leadershipRole: metadata.leadership.role.fr,
      leadershipBiography: metadata.leadership.biography.fr,
      leadershipHighlights: metadata.leadership.highlights.fr,
    };
  }

  return {
    thesis: metadata.thesis.en,
    overview: metadata.overview.en,
    investmentCase: metadata.investmentCase.en,
    strengths: metadata.strengths.en,
    weaknesses: metadata.weaknesses.en,
    leadershipRole: metadata.leadership.role.en,
    leadershipBiography: metadata.leadership.biography.en,
    leadershipHighlights: metadata.leadership.highlights.en,
  };
}

export function getCompanySectorLabel(
  sectorId: string,
  sectorOptions: StepOption[]
) {
  return (
    sectorOptions.find((sectorOption) => sectorOption.id === sectorId)?.label ??
    sectorId
  );
}

export function formatCompanyCurrency(
  value: number | null,
  language: Language
) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat(language === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCompanyRatio(value: number | null, suffix = "") {
  if (value === null) {
    return "-";
  }

  return `${value.toFixed(1)}${suffix}`;
}

export function formatCompanyMetricsDate(value: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "medium",
  }).format(value);
}

export function buildCompanyFinancialCards(
  companyFinancialMetrics: CompanyLatestFinancialMetrics | null,
  metricsCopy: CompanyPageCopy["metrics"],
  language: Language
): CompanyMetricCard[] {
  return [
    {
      label: metricsCopy.revenue,
      value: formatCompanyCurrency(companyFinancialMetrics?.revenue ?? null, language),
    },
    {
      label: metricsCopy.netIncome,
      value: formatCompanyCurrency(
        companyFinancialMetrics?.netIncome ?? null,
        language
      ),
    },
    {
      label: metricsCopy.debt,
      value: formatCompanyCurrency(companyFinancialMetrics?.debt ?? null, language),
    },
    {
      label: metricsCopy.freeCashFlow,
      value: formatCompanyCurrency(
        companyFinancialMetrics?.freeCashFlow ?? null,
        language
      ),
    },
    {
      label: metricsCopy.ebitda,
      value: formatCompanyCurrency(companyFinancialMetrics?.ebitda ?? null, language),
    },
    {
      label: metricsCopy.peRatio,
      value: formatCompanyRatio(companyFinancialMetrics?.peRatio ?? null, "x"),
    },
    {
      label: metricsCopy.netMargin,
      value: formatCompanyRatio(companyFinancialMetrics?.netMargin ?? null, "%"),
    },
  ];
}
