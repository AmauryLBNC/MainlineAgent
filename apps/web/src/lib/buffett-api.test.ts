import {
  DEFAULT_BUFFETT_API_URL,
  fromBuffettCompanyLookupResponse,
  fromBuffettBackendResponse,
  fromBuffettSearchResponse,
  getBuffettApiBaseUrl,
  toBuffettBackendRequest,
  validateBuffettScoreInput,
} from "@/lib/buffett-api";

describe("buffett-api", () => {
  const originalBuffettApiUrl = process.env.BUFFETT_API_URL;

  afterEach(() => {
    if (originalBuffettApiUrl === undefined) {
      delete process.env.BUFFETT_API_URL;
      return;
    }

    process.env.BUFFETT_API_URL = originalBuffettApiUrl;
  });

  it("validates manual company payloads and applies optional defaults", () => {
    const result = validateBuffettScoreInput({
      name: "NovaSpark",
      sector: "technology",
      country: "France",
      revenue: "845000000",
      netIncome: "126000000",
      debt: "",
      shareholdersEquity: "-25000000",
      freeCashFlow: "149000000",
      ebitda: "201000000",
      peRatio: "18.4",
      netMargin: "",
      environmentalScore: "",
      socialScore: "81",
      governanceScore: "79",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Validation should have succeeded.");
    }

    expect(result.data.debt).toBe(0);
    expect(result.data.shareholdersEquity).toBe(-25000000);
    expect(result.data.netMargin).toBeNull();
    expect(result.data.environmentalScore).toBe(60);
    expect(result.data.socialScore).toBe(81);
  });

  it("rejects incomplete payloads", () => {
    const result = validateBuffettScoreInput({
      name: "",
      sector: "",
      revenue: 0,
      peRatio: -3,
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Validation should have failed.");
    }

    expect(result.fieldErrors.name).toBeTruthy();
    expect(result.fieldErrors.sector).toBeTruthy();
    expect(result.fieldErrors.revenue).toBeTruthy();
    expect(result.fieldErrors.peRatio).toBeTruthy();
  });

  it("maps the frontend contract to the Python backend contract", () => {
    const validationResult = validateBuffettScoreInput({
      name: "Orion Patrimoine",
      sector: "finance",
      country: "Luxembourg",
      revenue: 690000000,
      netIncome: 111000000,
      debt: 58000000,
      shareholdersEquity: 460000000,
      freeCashFlow: 132000000,
      ebitda: 173000000,
      peRatio: 14.5,
      netMargin: 16.1,
      environmentalScore: 71,
      socialScore: 76,
      governanceScore: 83,
    });

    expect(validationResult.success).toBe(true);

    if (!validationResult.success) {
      throw new Error("Validation should have succeeded.");
    }

    expect(toBuffettBackendRequest(validationResult.data)).toEqual({
      name: "Orion Patrimoine",
      sector: "finance",
      country: "Luxembourg",
      revenue: 690000000,
      net_income: 111000000,
      debt: 58000000,
      shareholders_equity: 460000000,
      free_cash_flow: 132000000,
      ebitda: 173000000,
      pe_ratio: 14.5,
      net_margin: 16.1,
      environmental_score: 71,
      social_score: 76,
      governance_score: 83,
    });
  });

  it("normalizes the python response for the web app", () => {
    const result = fromBuffettBackendResponse({
      company_id: 4,
      slug: "orion-patrimoine",
      name: "Orion Patrimoine",
      sector: "finance",
      country: "Luxembourg",
      score: 88.2,
      tier: "excellent",
      heuristic_score: 87.1,
      component_scores: {
        profitability: 87,
        cash_generation: 90,
      },
      rationale: ["Cash generation is strong."],
      feature_vector: {
        revenue_millions: 690,
      },
      manual_label_score: 88,
      manual_notes: ["High-quality compounder."],
    });

    expect(result.companyId).toBe(4);
    expect(result.heuristicScore).toBe(87.1);
    expect(result.componentScores.cash_generation).toBe(90);
    expect(result.manualLabelScore).toBe(88);
  });

  it("normalizes Yahoo Finance search results", () => {
    const result = fromBuffettSearchResponse({
      query: "apple",
      companies: [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          exchange: "NASDAQ",
          sector: "Technology",
          industry: "Consumer Electronics",
          quote_type: "EQUITY",
        },
      ],
    });

    expect(result).toEqual([
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        exchange: "NASDAQ",
        sector: "Technology",
        industry: "Consumer Electronics",
        quoteType: "EQUITY",
      },
    ]);
  });

  it("normalizes Yahoo Finance company payloads", () => {
    const result = fromBuffettCompanyLookupResponse({
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "technology",
      industry: "Consumer Electronics",
      country: "United States",
      city: "Cupertino",
      state: "CA",
      revenue: 435617005568,
      net_income: 117000000000,
      debt: 98657000000,
      shareholders_equity: 73733000000,
      free_cash_flow: 106312753152,
      ebitda: 152901992448,
      pe_ratio: 31.48,
      net_margin: 27.04,
      full_time_employees: 150000,
      ceo_name: "Tim Cook",
      ceo_title: "CEO & Director",
      environmental_score: 60,
      social_score: 60,
      governance_score: 60,
      source: "yahoo_finance",
    });

    expect(result.symbol).toBe("AAPL");
    expect(result.industry).toBe("Consumer Electronics");
    expect(result.ceoName).toBe("Tim Cook");
    expect(result.fullTimeEmployees).toBe(150000);
    expect(result.shareholdersEquity).toBe(73733000000);
    expect(result.netMargin).toBe(27.04);
  });

  it("uses the configured python base url when present", () => {
    expect(getBuffettApiBaseUrl()).toBe(DEFAULT_BUFFETT_API_URL);

    process.env.BUFFETT_API_URL = "http://127.0.0.1:8020/";

    expect(getBuffettApiBaseUrl()).toBe("http://127.0.0.1:8020");
  });
});
