import { prisma } from "@/lib/prisma";

type LocalizedText = {
  fr: string;
  en: string;
};

type LocalizedTextList = {
  fr: string[];
  en: string[];
};

type CompanyProfileMetadata = {
  thesis: LocalizedText;
  overview: LocalizedTextList;
  strengths: LocalizedTextList;
  weaknesses: LocalizedTextList;
  investmentCase: LocalizedTextList;
  leadership: {
    name: string;
    role: LocalizedText;
    biography: LocalizedTextList;
    highlights: LocalizedTextList;
  };
};

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

function getCompanyMetadata(metadata: unknown): CompanyProfileMetadata {
  const record = isRecord(metadata) ? metadata : {};

  return {
    thesis: getLocalizedText(
      record.thesis,
      "Entreprise de qualite avec visibilite long terme.",
      "Quality company with strong long-term visibility."
    ),
    overview: getLocalizedTextList(record.overview),
    strengths: getLocalizedTextList(record.strengths),
    weaknesses: getLocalizedTextList(record.weaknesses),
    investmentCase: getLocalizedTextList(record.investmentCase),
    leadership: {
      name:
        isRecord(record.leadership) && typeof record.leadership.name === "string"
          ? record.leadership.name
          : "Unknown leader",
      role: getLocalizedText(
        isRecord(record.leadership) ? record.leadership.role : undefined,
        "Direction generale",
        "Executive leadership"
      ),
      biography: getLocalizedTextList(
        isRecord(record.leadership) ? record.leadership.biography : undefined
      ),
      highlights: getLocalizedTextList(
        isRecord(record.leadership) ? record.leadership.highlights : undefined
      ),
    },
  };
}

function toNumber(value: unknown) {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function listCompaniesForMomoIA() {
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      slug: true,
      name: true,
      ticker: true,
      sector: true,
      country: true,
      website: true,
      financialMetrics: {
        orderBy: {
          asOf: "desc",
        },
        take: 1,
        select: {
          peRatio: true,
          netMargin: true,
        },
      },
      extraFinancial: {
        select: {
          metadata: true,
        },
      },
    },
  });

  return companies.map((company) => {
    const metadata = getCompanyMetadata(company.extraFinancial?.metadata);
    const latestMetrics = company.financialMetrics[0];

    return {
      id: company.id,
      slug: company.slug,
      name: company.name,
      ticker: company.ticker,
      sector: company.sector,
      country: company.country,
      website: company.website,
      thesis: metadata.thesis,
      latestMetrics: latestMetrics
        ? {
            peRatio: toNumber(latestMetrics.peRatio),
            netMargin: toNumber(latestMetrics.netMargin),
          }
      : null,
    };
  });
}
