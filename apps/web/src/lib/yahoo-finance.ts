import type {
  BuffettCompanyLookupResult,
  BuffettSearchSuggestion,
} from "@/lib/buffett-api";

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0",
  Accept: "application/json",
};

type YahooSearchApiResponse = {
  quotes?: Array<Record<string, unknown>>;
};

type YahooTimeseriesApiResponse = {
  timeseries?: {
    result?: Array<Record<string, unknown>>;
  };
};

type YahooQuoteApiResponse = {
  quoteResponse?: {
    result?: Array<Record<string, unknown>>;
  };
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeSector(sector: string | null | undefined) {
  const normalizedSector = (sector ?? "").trim().toLowerCase();

  if (!normalizedSector) {
    return "services";
  }

  switch (normalizedSector) {
    case "technology":
      return "technology";
    case "healthcare":
      return "health";
    case "financial services":
    case "financial":
      return "finance";
    case "industrials":
    case "basic materials":
      return "industry";
    case "consumer cyclical":
    case "consumer defensive":
    case "consumer staples":
      return "consumer";
    case "energy":
      return "energy";
    case "real estate":
      return "real_estate";
    case "utilities":
      return "infrastructure";
    case "communication services":
      return "services";
    default:
      return normalizedSector.replace(/\s+/g, "_");
  }
}

function extractLatestTimeseriesValue(
  seriesEntries: Array<Record<string, unknown>> | undefined
) {
  if (!Array.isArray(seriesEntries) || seriesEntries.length === 0) {
    return null;
  }

  const latestEntry = [...seriesEntries]
    .filter((entry) => typeof entry.asOfDate === "string")
    .sort((leftEntry, rightEntry) =>
      String(rightEntry.asOfDate).localeCompare(String(leftEntry.asOfDate))
    )[0];

  if (!latestEntry || typeof latestEntry !== "object") {
    return null;
  }

  const reportedValue =
    latestEntry.reportedValue &&
    typeof latestEntry.reportedValue === "object" &&
    "raw" in latestEntry.reportedValue
      ? latestEntry.reportedValue.raw
      : null;

  return parseNumber(reportedValue);
}

function findTimeseriesValue(
  payload: YahooTimeseriesApiResponse,
  key: string
) {
  const result = payload.timeseries?.result?.find(
    (entry) =>
      Array.isArray(entry.meta) === false &&
      entry.meta &&
      typeof entry.meta === "object" &&
      "type" in entry.meta &&
      Array.isArray((entry.meta as { type?: unknown }).type) &&
      (entry.meta as { type: unknown[] }).type[0] === key
  );

  if (!result) {
    return null;
  }

  const seriesEntries = result[key];
  return extractLatestTimeseriesValue(
    Array.isArray(seriesEntries)
      ? (seriesEntries as Array<Record<string, unknown>>)
      : undefined
  );
}

export async function searchYahooFinanceCompanies(
  query: string
): Promise<BuffettSearchSuggestion[]> {
  const sanitizedQuery = query.trim();

  if (sanitizedQuery.length < 2) {
    return [];
  }

  const response = await fetch(
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
      sanitizedQuery
    )}&quotesCount=8&newsCount=0&listsCount=0&enableFuzzyQuery=true`,
    {
      headers: YAHOO_HEADERS,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Yahoo search failed with status ${response.status}`);
  }

  const payload = (await response.json()) as YahooSearchApiResponse;

  return (payload.quotes ?? [])
    .filter((quote) => normalizeText(quote.quoteType) === "EQUITY")
    .map((quote) => {
      const symbol = normalizeText(quote.symbol);
      const name = normalizeText(quote.longname) || normalizeText(quote.shortname);

      if (!symbol || !name) {
        return null;
      }

      return {
        symbol,
        name,
        exchange: normalizeText(quote.exchDisp) || normalizeText(quote.exchange) || null,
        sector: normalizeText(quote.sector) || null,
        industry: normalizeText(quote.industry) || null,
        quoteType: normalizeText(quote.quoteType) || null,
      } satisfies BuffettSearchSuggestion;
    })
    .filter((quote): quote is BuffettSearchSuggestion => quote !== null);
}

export async function getYahooFinanceCompanyProfile(
  symbol: string
): Promise<BuffettCompanyLookupResult> {
  const sanitizedSymbol = symbol.trim().toUpperCase();

  if (!sanitizedSymbol) {
    throw new Error("Le ticker Yahoo Finance est obligatoire.");
  }

  const searchRequest = searchYahooFinanceCompanies(sanitizedSymbol);
  const fundamentalsRequest = fetch(
    `https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${encodeURIComponent(
      sanitizedSymbol
    )}?type=annualTotalRevenue,annualNetIncomeContinuousOperations,annualFreeCashFlow,annualTotalDebt,annualStockholdersEquity,annualEBITDA&period1=1609459200&period2=1893456000`,
    {
      headers: YAHOO_HEADERS,
      cache: "no-store",
    }
  );
  const quoteRequest = Promise.resolve(
    fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(
        sanitizedSymbol
      )}`,
      {
        headers: YAHOO_HEADERS,
        cache: "no-store",
      }
    )
  ).catch(() => null);

  const [searchResults, fundamentalsResponse, quoteResponse] = await Promise.all([
    searchRequest,
    fundamentalsRequest,
    quoteRequest,
  ]);

  if (!fundamentalsResponse.ok) {
    throw new Error(
      `Yahoo fundamentals failed with status ${fundamentalsResponse.status}`
    );
  }

  const metadata =
    searchResults.find((company) => company.symbol === sanitizedSymbol) ??
    searchResults[0] ??
    null;

  const fundamentalsPayload =
    (await fundamentalsResponse.json()) as YahooTimeseriesApiResponse;
  const quotePayload = quoteResponse && quoteResponse.ok
    ? ((await quoteResponse.json()) as YahooQuoteApiResponse)
    : null;
  const quote =
    quotePayload?.quoteResponse?.result?.find(
      (entry) => normalizeText(entry.symbol) === sanitizedSymbol
    ) ?? quotePayload?.quoteResponse?.result?.[0] ?? null;

  const revenue = findTimeseriesValue(fundamentalsPayload, "annualTotalRevenue");
  const netIncome = findTimeseriesValue(
    fundamentalsPayload,
    "annualNetIncomeContinuousOperations"
  );
  const debt = findTimeseriesValue(fundamentalsPayload, "annualTotalDebt");
  const shareholdersEquity = findTimeseriesValue(
    fundamentalsPayload,
    "annualStockholdersEquity"
  );
  const freeCashFlow = findTimeseriesValue(
    fundamentalsPayload,
    "annualFreeCashFlow"
  );
  const ebitda = findTimeseriesValue(fundamentalsPayload, "annualEBITDA");
  const netMargin =
    revenue && netIncome && revenue !== 0 ? (netIncome / revenue) * 100 : null;

  return {
    symbol: sanitizedSymbol,
    name: metadata?.name ?? sanitizedSymbol,
    sector: normalizeSector(metadata?.sector),
    industry: metadata?.industry ?? null,
    marketPrice: parseNumber(quote?.regularMarketPrice),
    country: null,
    exchange: metadata?.exchange ?? null,
    currency: normalizeText(quote?.currency) || null,
    website: null,
    city: null,
    state: null,
    fullTimeEmployees: null,
    ceoName: null,
    ceoTitle: null,
    summary: null,
    revenue,
    netIncome,
    debt,
    shareholdersEquity,
    freeCashFlow,
    ebitda,
    peRatio: 15,
    netMargin,
    environmentalScore: 60,
    socialScore: 60,
    governanceScore: 60,
    source: "yahoo_finance_public",
  };
}
