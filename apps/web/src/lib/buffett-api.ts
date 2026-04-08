export const DEFAULT_BUFFETT_API_URL = "http://127.0.0.1:8010";

export type BuffettScoreInput = {
  name: string;
  sector: string;
  country: string | null;
  revenue: number;
  netIncome: number;
  debt: number;
  shareholdersEquity: number | null;
  freeCashFlow: number;
  ebitda: number;
  peRatio: number;
  netMargin: number | null;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
};

export type BuffettScoreResult = {
  companyId: number | null;
  slug: string | null;
  name: string;
  sector: string;
  country: string | null;
  score: number;
  tier: string;
  heuristicScore: number;
  componentScores: Record<string, number>;
  rationale: string[];
  featureVector: Record<string, number>;
  manualLabelScore: number | null;
  manualNotes: string[];
};

export type BuffettSearchSuggestion = {
  symbol: string;
  name: string;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  quoteType: string | null;
};

export type BuffettCompanyLookupResult = {
  symbol: string;
  name: string;
  sector: string;
  industry: string | null;
  marketPrice: number | null;
  country: string | null;
  exchange: string | null;
  currency: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  fullTimeEmployees: number | null;
  ceoName: string | null;
  ceoTitle: string | null;
  summary: string | null;
  revenue: number | null;
  netIncome: number | null;
  debt: number | null;
  shareholdersEquity: number | null;
  freeCashFlow: number | null;
  ebitda: number | null;
  peRatio: number | null;
  netMargin: number | null;
  environmentalScore: number | null;
  socialScore: number | null;
  governanceScore: number | null;
  source: string;
};

type BuffettBackendResponse = {
  company_id?: unknown;
  slug?: unknown;
  name?: unknown;
  sector?: unknown;
  country?: unknown;
  score?: unknown;
  tier?: unknown;
  heuristic_score?: unknown;
  component_scores?: unknown;
  rationale?: unknown;
  feature_vector?: unknown;
  manual_label_score?: unknown;
  manual_notes?: unknown;
};

type BuffettSearchResponse = {
  query?: unknown;
  companies?: unknown;
};

type BuffettCompanyLookupResponse = {
  symbol?: unknown;
  name?: unknown;
  sector?: unknown;
  industry?: unknown;
  market_price?: unknown;
  country?: unknown;
  exchange?: unknown;
  currency?: unknown;
  website?: unknown;
  city?: unknown;
  state?: unknown;
  full_time_employees?: unknown;
  ceo_name?: unknown;
  ceo_title?: unknown;
  summary?: unknown;
  revenue?: unknown;
  net_income?: unknown;
  debt?: unknown;
  shareholders_equity?: unknown;
  free_cash_flow?: unknown;
  ebitda?: unknown;
  pe_ratio?: unknown;
  net_margin?: unknown;
  environmental_score?: unknown;
  social_score?: unknown;
  governance_score?: unknown;
  source?: unknown;
};

type ValidationSuccess = {
  success: true;
  data: BuffettScoreInput;
};

type ValidationFailure = {
  success: false;
  message: string;
  fieldErrors: Record<string, string>;
};

export type BuffettScoreValidationResult =
  | ValidationSuccess
  | ValidationFailure;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim().replace(",", ".");

    if (!trimmedValue) {
      return null;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function parseStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function parseNumericRecord(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, rawValue]) => {
        const parsedValue = parseNumber(rawValue);
        return parsedValue === null ? null : [key, parsedValue];
      })
      .filter((entry): entry is [string, number] => Array.isArray(entry))
  );
}

export function getBuffettApiBaseUrl() {
  const configuredBaseUrl = process.env.BUFFETT_API_URL?.trim();

  if (!configuredBaseUrl) {
    return DEFAULT_BUFFETT_API_URL;
  }

  return configuredBaseUrl.replace(/\/+$/, "");
}

export function validateBuffettScoreInput(
  payload: unknown
): BuffettScoreValidationResult {
  if (!isRecord(payload)) {
    return {
      success: false,
      message: "Payload invalide.",
      fieldErrors: {
        form: "Le contenu envoye a l'API n'est pas un objet exploitable.",
      },
    };
  }

  const fieldErrors: Record<string, string> = {};
  const name = normalizeText(payload.name);
  const sector = normalizeText(payload.sector);
  const country = normalizeText(payload.country) || null;
  const revenue = parseNumber(payload.revenue);
  const netIncome = parseNumber(payload.netIncome);
  const debt = parseNumber(payload.debt);
  const shareholdersEquity = parseNumber(payload.shareholdersEquity);
  const freeCashFlow = parseNumber(payload.freeCashFlow);
  const ebitda = parseNumber(payload.ebitda);
  const peRatio = parseNumber(payload.peRatio);
  const netMargin = parseNumber(payload.netMargin);
  const environmentalScore = parseNumber(payload.environmentalScore);
  const socialScore = parseNumber(payload.socialScore);
  const governanceScore = parseNumber(payload.governanceScore);

  if (!name) {
    fieldErrors.name = "Le nom de l'entreprise est obligatoire.";
  }

  if (!sector) {
    fieldErrors.sector = "Le secteur est obligatoire.";
  }

  if (revenue === null || revenue <= 0) {
    fieldErrors.revenue = "Le chiffre d'affaires doit etre superieur a 0.";
  }

  if (netIncome === null) {
    fieldErrors.netIncome = "Le resultat net est obligatoire.";
  }

  if (freeCashFlow === null) {
    fieldErrors.freeCashFlow = "Le free cash-flow est obligatoire.";
  }

  if (ebitda === null) {
    fieldErrors.ebitda = "L'EBITDA est obligatoire.";
  }

  if (peRatio === null || peRatio <= 0) {
    fieldErrors.peRatio = "Le PER doit etre superieur a 0.";
  }

  if (debt !== null && debt < 0) {
    fieldErrors.debt = "La dette ne peut pas etre negative.";
  }

  if (netMargin !== null && (netMargin < -100 || netMargin > 100)) {
    fieldErrors.netMargin = "La marge nette doit rester entre -100 et 100.";
  }

  const normalizedEnvironmentalScore = environmentalScore ?? 60;
  const normalizedSocialScore = socialScore ?? 60;
  const normalizedGovernanceScore = governanceScore ?? 60;

  if (
    normalizedEnvironmentalScore < 0 ||
    normalizedEnvironmentalScore > 100
  ) {
    fieldErrors.environmentalScore =
      "Le score environnement doit etre compris entre 0 et 100.";
  }

  if (normalizedSocialScore < 0 || normalizedSocialScore > 100) {
    fieldErrors.socialScore =
      "Le score social doit etre compris entre 0 et 100.";
  }

  if (normalizedGovernanceScore < 0 || normalizedGovernanceScore > 100) {
    fieldErrors.governanceScore =
      "Le score gouvernance doit etre compris entre 0 et 100.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      message: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      name,
      sector,
      country,
      revenue: revenue!,
      netIncome: netIncome!,
      debt: debt ?? 0,
      shareholdersEquity,
      freeCashFlow: freeCashFlow!,
      ebitda: ebitda!,
      peRatio: peRatio!,
      netMargin,
      environmentalScore: normalizedEnvironmentalScore,
      socialScore: normalizedSocialScore,
      governanceScore: normalizedGovernanceScore,
    },
  };
}

export function toBuffettBackendRequest(input: BuffettScoreInput) {
  return {
    name: input.name,
    sector: input.sector,
    country: input.country,
    revenue: input.revenue,
    net_income: input.netIncome,
    debt: input.debt,
    shareholders_equity: input.shareholdersEquity,
    free_cash_flow: input.freeCashFlow,
    ebitda: input.ebitda,
    pe_ratio: input.peRatio,
    net_margin: input.netMargin,
    environmental_score: input.environmentalScore,
    social_score: input.socialScore,
    governance_score: input.governanceScore,
  };
}

export function fromBuffettSearchResponse(
  payload: BuffettSearchResponse
): BuffettSearchSuggestion[] {
  if (!Array.isArray(payload.companies)) {
    throw new Error("La reponse de recherche Yahoo Finance est invalide.");
  }

  return payload.companies
    .filter(isRecord)
    .map((company) => {
      const symbol = normalizeText(company.symbol);
      const name = normalizeText(company.name);

      if (!symbol || !name) {
        return null;
      }

      return {
        symbol,
        name,
        exchange: normalizeText(company.exchange) || null,
        sector: normalizeText(company.sector) || null,
        industry: normalizeText(company.industry) || null,
        quoteType: normalizeText(company.quote_type) || null,
      } satisfies BuffettSearchSuggestion;
    })
    .filter((company): company is BuffettSearchSuggestion => company !== null);
}

export function fromBuffettCompanyLookupResponse(
  payload: BuffettCompanyLookupResponse
): BuffettCompanyLookupResult {
  const symbol = normalizeText(payload.symbol);
  const name = normalizeText(payload.name);
  const sector = normalizeText(payload.sector);

  if (!symbol || !name || !sector) {
    throw new Error("La fiche Yahoo Finance renvoyee est invalide.");
  }

  return {
    symbol,
    name,
    sector,
    industry: normalizeText(payload.industry) || null,
    marketPrice: parseNumber(payload.market_price),
    country: normalizeText(payload.country) || null,
    exchange: normalizeText(payload.exchange) || null,
    currency: normalizeText(payload.currency) || null,
    website: normalizeText(payload.website) || null,
    city: normalizeText(payload.city) || null,
    state: normalizeText(payload.state) || null,
    fullTimeEmployees: parseNumber(payload.full_time_employees),
    ceoName: normalizeText(payload.ceo_name) || null,
    ceoTitle: normalizeText(payload.ceo_title) || null,
    summary: normalizeText(payload.summary) || null,
    revenue: parseNumber(payload.revenue),
    netIncome: parseNumber(payload.net_income),
    debt: parseNumber(payload.debt),
    shareholdersEquity: parseNumber(payload.shareholders_equity),
    freeCashFlow: parseNumber(payload.free_cash_flow),
    ebitda: parseNumber(payload.ebitda),
    peRatio: parseNumber(payload.pe_ratio),
    netMargin: parseNumber(payload.net_margin),
    environmentalScore: parseNumber(payload.environmental_score),
    socialScore: parseNumber(payload.social_score),
    governanceScore: parseNumber(payload.governance_score),
    source: normalizeText(payload.source) || "yahoo_finance",
  };
}

export function fromBuffettBackendResponse(
  payload: BuffettBackendResponse
): BuffettScoreResult {
  const score = parseNumber(payload.score);
  const heuristicScore = parseNumber(payload.heuristic_score);

  if (
    typeof payload.name !== "string" ||
    typeof payload.sector !== "string" ||
    score === null ||
    heuristicScore === null
  ) {
    throw new Error("Le backend Buffett a renvoye une reponse invalide.");
  }

  const companyId = parseNumber(payload.company_id);
  const manualLabelScore = parseNumber(payload.manual_label_score);

  return {
    companyId: companyId === null ? null : companyId,
    slug: typeof payload.slug === "string" ? payload.slug : null,
    name: payload.name,
    sector: payload.sector,
    country: typeof payload.country === "string" ? payload.country : null,
    score,
    tier: typeof payload.tier === "string" ? payload.tier : "correct",
    heuristicScore,
    componentScores: parseNumericRecord(payload.component_scores),
    rationale: parseStringArray(payload.rationale),
    featureVector: parseNumericRecord(payload.feature_vector),
    manualLabelScore,
    manualNotes: parseStringArray(payload.manual_notes),
  };
}
