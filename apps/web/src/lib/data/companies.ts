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

export type CompanyCatalogSort = "name" | "peRatio" | "netMargin";
export type CompanyCatalogOrder = "asc" | "desc";

export type CompanyCatalogFilters = {
  search?: string;
  sector?: string;
  country?: string;
  sort?: CompanyCatalogSort;
  order?: CompanyCatalogOrder;
  page?: number;
  limit?: number;
};

export type CompanyCatalogCompany = {
  id: number;
  slug: string;
  name: string;
  ticker: string | null;
  sector: string;
  country: string | null;
  website: string | null;
  thesis: {
    fr: string;
    en: string;
  };
  latestMetrics: {
    peRatio: number | null;
    netMargin: number | null;
  } | null;
};

export type CompanyCatalogMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  availableSectors: string[];
  availableCountries: string[];
  appliedFilters: {
    search: string | null;
    sector: string | null;
    country: string | null;
    sort: CompanyCatalogSort;
    order: CompanyCatalogOrder;
  };
};

export type CompanyCatalogResult = {
  companies: CompanyCatalogCompany[];
  meta: CompanyCatalogMeta;
};

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT: CompanyCatalogSort = "name";
const DEFAULT_ORDER: CompanyCatalogOrder = "asc";

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

function normalizeText(value: string | null | undefined) {
  const normalizedValue = value?.trim();
  return normalizedValue ? normalizedValue : undefined;
}

function normalizePositiveInt(
  value: string | null | undefined,
  fallback: number,
  max?: number
) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  if (max !== undefined) {
    return Math.min(parsedValue, max);
  }

  return parsedValue;
}

export function parseCompanyCatalogSearchParams(searchParams: URLSearchParams) {
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");

  return {
    search: normalizeText(searchParams.get("q")),
    sector: normalizeText(searchParams.get("sector")),
    country: normalizeText(searchParams.get("country")),
    sort:
      sort === "peRatio" || sort === "netMargin" || sort === "name"
        ? sort
        : DEFAULT_SORT,
    order: order === "desc" || order === "asc" ? order : DEFAULT_ORDER,
    page: normalizePositiveInt(searchParams.get("page"), DEFAULT_PAGE),
    limit: normalizePositiveInt(searchParams.get("limit"), DEFAULT_LIMIT, MAX_LIMIT),
  } satisfies CompanyCatalogFilters;
}

export function sortCompaniesForCatalog(
  companies: CompanyCatalogCompany[],
  sort: CompanyCatalogSort,
  order: CompanyCatalogOrder
) {
  const direction = order === "asc" ? 1 : -1;
  const sortedCompanies = [...companies];

  sortedCompanies.sort((leftCompany, rightCompany) => {
    if (sort === "name") {
      return leftCompany.name.localeCompare(rightCompany.name, "fr", {
        sensitivity: "base",
      }) * direction;
    }

    const leftMetric = leftCompany.latestMetrics?.[sort] ?? null;
    const rightMetric = rightCompany.latestMetrics?.[sort] ?? null;

    if (leftMetric === null && rightMetric === null) {
      return leftCompany.name.localeCompare(rightCompany.name, "fr", {
        sensitivity: "base",
      });
    }

    if (leftMetric === null) {
      return 1;
    }

    if (rightMetric === null) {
      return -1;
    }

    if (leftMetric === rightMetric) {
      return leftCompany.name.localeCompare(rightCompany.name, "fr", {
        sensitivity: "base",
      });
    }

    return (leftMetric - rightMetric) * direction;
  });

  return sortedCompanies;
}

function buildCompanyCatalogMeta(
  companies: CompanyCatalogCompany[],
  filters: Required<Pick<CompanyCatalogFilters, "page" | "limit" | "sort" | "order">> &
    Pick<CompanyCatalogFilters, "search" | "sector" | "country">
): CompanyCatalogMeta {
  return {
    total: companies.length,
    page: filters.page,
    limit: filters.limit,
    totalPages: Math.max(1, Math.ceil(companies.length / filters.limit)),
    availableSectors: Array.from(new Set(companies.map((company) => company.sector))).sort(
      (leftSector, rightSector) => leftSector.localeCompare(rightSector, "fr")
    ),
    availableCountries: Array.from(
      new Set(
        companies
          .map((company) => company.country)
          .filter((country): country is string => Boolean(country))
      )
    ).sort((leftCountry, rightCountry) => leftCountry.localeCompare(rightCountry, "fr")),
    appliedFilters: {
      search: filters.search ?? null,
      sector: filters.sector ?? null,
      country: filters.country ?? null,
      sort: filters.sort,
      order: filters.order,
    },
  };
}

export async function listCompaniesForMomoIA(
  filters: CompanyCatalogFilters = {}
): Promise<CompanyCatalogResult> {
  const search = normalizeText(filters.search);
  const sector = normalizeText(filters.sector);
  const country = normalizeText(filters.country);
  const sort = filters.sort ?? DEFAULT_SORT;
  const order = filters.order ?? DEFAULT_ORDER;
  const page = normalizePositiveInt(String(filters.page ?? DEFAULT_PAGE), DEFAULT_PAGE);
  const limit = normalizePositiveInt(
    String(filters.limit ?? DEFAULT_LIMIT),
    DEFAULT_LIMIT,
    MAX_LIMIT
  );

  const companies = await prisma.company.findMany({
    where: {
      ...(sector ? { sector } : {}),
      ...(country ? { country } : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                ticker: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
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

  const mappedCompanies = companies.map<CompanyCatalogCompany>((company) => {
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

  const sortedCompanies = sortCompaniesForCatalog(mappedCompanies, sort, order);
  const meta = buildCompanyCatalogMeta(sortedCompanies, {
    search,
    sector,
    country,
    sort,
    order,
    page,
    limit,
  });

  const startIndex = (page - 1) * limit;
  const paginatedCompanies = sortedCompanies.slice(startIndex, startIndex + limit);

  return {
    companies: paginatedCompanies,
    meta,
  };
}
