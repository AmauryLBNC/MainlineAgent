import {
  buildCompanyFinancialCards,
  getCompanyProfileMetadata,
  getCompanySectorLabel,
  getLocalizedCompanyContent,
  toNullableNumber,
} from "./utils";

describe("company page utils", () => {
  it("normalizes metadata and falls back when the payload is incomplete", () => {
    const metadata = getCompanyProfileMetadata({
      thesis: { fr: "These FR" },
      overview: { fr: ["Overview FR"], en: ["Overview EN", 12] },
      leadership: {
        name: "Claire Duval",
        biography: { fr: ["Bio FR"], en: ["Bio EN"] },
      },
    });

    expect(metadata.thesis).toEqual({
      fr: "These FR",
      en: "Quality company with strong long-term visibility.",
    });
    expect(metadata.overview.fr).toEqual(["Overview FR"]);
    expect(metadata.overview.en).toEqual(["Overview EN"]);
    expect(metadata.leadership.name).toBe("Claire Duval");
    expect(metadata.leadership.role.fr).toBe("Direction generale");
    expect(metadata.leadership.role.en).toBe("Executive leadership");
  });

  it("returns localized content for the requested language", () => {
    const metadata = getCompanyProfileMetadata({
      thesis: { fr: "These FR", en: "Thesis EN" },
      overview: { fr: ["Vue FR"], en: ["View EN"] },
      strengths: { fr: ["Forces FR"], en: ["Strengths EN"] },
      weaknesses: { fr: ["Risques FR"], en: ["Risks EN"] },
      investmentCase: { fr: ["Raison FR"], en: ["Why EN"] },
      leadership: {
        name: "Leader",
        role: { fr: "PDG", en: "CEO" },
        biography: { fr: ["Bio FR"], en: ["Bio EN"] },
        highlights: { fr: ["Point FR"], en: ["Point EN"] },
      },
    });

    expect(getLocalizedCompanyContent(metadata, "fr")).toMatchObject({
      thesis: "These FR",
      leadershipRole: "PDG",
      overview: ["Vue FR"],
    });
    expect(getLocalizedCompanyContent(metadata, "en")).toMatchObject({
      thesis: "Thesis EN",
      leadershipRole: "CEO",
      overview: ["View EN"],
    });
  });

  it("formats financial cards and keeps missing values explicit", () => {
    const cards = buildCompanyFinancialCards(
      {
        asOf: new Date("2026-01-01"),
        revenue: 1_250_000_000,
        netIncome: null,
        debt: 250_000_000,
        freeCashFlow: 400_000_000,
        ebitda: 550_000_000,
        peRatio: 15.23,
        netMargin: 21.04,
      },
      {
        asOf: "Data as of",
        revenue: "Revenue",
        netIncome: "Net income",
        debt: "Debt",
        freeCashFlow: "Free cash flow",
        ebitda: "EBITDA",
        peRatio: "P/E",
        netMargin: "Net margin",
      },
      "en"
    );

    expect(cards[0]).toEqual({ label: "Revenue", value: "€1.3B" });
    expect(cards[1]).toEqual({ label: "Net income", value: "-" });
    expect(cards[5]).toEqual({ label: "P/E", value: "15.2x" });
    expect(cards[6]).toEqual({ label: "Net margin", value: "21.0%" });
  });

  it("resolves sector labels and numeric coercion safely", () => {
    expect(
      getCompanySectorLabel("technology", [
        { id: "technology", label: "Technology" },
      ])
    ).toBe("Technology");
    expect(getCompanySectorLabel("unknown", [])).toBe("unknown");
    expect(toNullableNumber("12.4")).toBe(12.4);
    expect(toNullableNumber("foo")).toBeNull();
    expect(toNullableNumber(null)).toBeNull();
  });
});
