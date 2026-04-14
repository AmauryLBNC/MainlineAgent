import {
  getYahooFinanceCompanyProfile,
  searchYahooFinanceCompanies,
} from "@/lib/yahoo-finance";

describe("yahoo-finance", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns autocomplete results for fuzzy queries like APPL", async () => {
    global.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          quotes: [
            {
              symbol: "AAPL",
              longname: "Apple Inc.",
              exchDisp: "NASDAQ",
              sector: "Technology",
              industry: "Consumer Electronics",
              quoteType: "EQUITY",
            },
          ],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }) as typeof fetch;

    await expect(searchYahooFinanceCompanies("APPL")).resolves.toEqual([
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

  it("extracts fundamentals including shareholder equity", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            quotes: [
              {
                symbol: "AAPL",
                longname: "Apple Inc.",
                exchDisp: "NASDAQ",
                sector: "Technology",
                industry: "Consumer Electronics",
                quoteType: "EQUITY",
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            timeseries: {
              result: [
                {
                  meta: {
                    type: ["annualTotalRevenue"],
                  },
                  annualTotalRevenue: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 435000000000 },
                    },
                  ],
                },
                {
                  meta: {
                    type: ["annualNetIncomeContinuousOperations"],
                  },
                  annualNetIncomeContinuousOperations: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 117000000000 },
                    },
                  ],
                },
                {
                  meta: {
                    type: ["annualTotalDebt"],
                  },
                  annualTotalDebt: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 98000000000 },
                    },
                  ],
                },
                {
                  meta: {
                    type: ["annualStockholdersEquity"],
                  },
                  annualStockholdersEquity: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 74000000000 },
                    },
                  ],
                },
                {
                  meta: {
                    type: ["annualFreeCashFlow"],
                  },
                  annualFreeCashFlow: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 108000000000 },
                    },
                  ],
                },
                {
                  meta: {
                    type: ["annualEBITDA"],
                  },
                  annualEBITDA: [
                    {
                      asOfDate: "2025-09-27",
                      reportedValue: { raw: 153000000000 },
                    },
                  ],
                },
              ],
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            quoteResponse: {
              result: [
                {
                  symbol: "AAPL",
                  regularMarketPrice: 214.75,
                  currency: "USD",
                },
              ],
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      ) as typeof fetch;

    await expect(getYahooFinanceCompanyProfile("aapl")).resolves.toMatchObject({
      symbol: "AAPL",
      name: "Apple Inc.",
      sector: "technology",
      industry: "Consumer Electronics",
      marketPrice: 214.75,
      exchange: "NASDAQ",
      revenue: 435000000000,
      netIncome: 117000000000,
      debt: 98000000000,
      shareholdersEquity: 74000000000,
      freeCashFlow: 108000000000,
      ebitda: 153000000000,
      netMargin: expect.closeTo(26.8965517241, 6),
      source: "yahoo_finance_public",
    });
  });
});
