import type { Language } from "@/components/i18n";

export type CompanyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export type StepOption = {
  id: string;
  label: string;
};

export type LocalizedText = {
  fr: string;
  en: string;
};

export type LocalizedTextList = {
  fr: string[];
  en: string[];
};

export type CompanyProfileMetadata = {
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

export type CompanyLatestFinancialMetrics = {
  asOf: Date;
  revenue: number | null;
  netIncome: number | null;
  debt: number | null;
  freeCashFlow: number | null;
  ebitda: number | null;
  peRatio: number | null;
  netMargin: number | null;
};

export type CompanyPageCompany = {
  id: number;
  slug: string;
  name: string;
  ticker: string | null;
  sector: string;
  country: string | null;
  website: string | null;
  metadata: CompanyProfileMetadata;
  latestMetrics: CompanyLatestFinancialMetrics | null;
  likesCount: number;
  isLiked: boolean;
};

export type CompanyLocalizedContent = {
  thesis: string;
  overview: string[];
  investmentCase: string[];
  strengths: string[];
  weaknesses: string[];
  leadershipRole: string;
  leadershipBiography: string[];
  leadershipHighlights: string[];
};

export type CompanyPageCopy = {
  eyebrow: string;
  backToMomoia: string;
  sector: string;
  ticker: string;
  country: string;
  website: string;
  likes: string;
  addToLikes: string;
  removeFromLikes: string;
  loginToLike: string;
  presentationEyebrow: string;
  presentationTitle: string;
  investmentCase: string;
  leadershipEyebrow: string;
  financialsEyebrow: string;
  financialsTitle: string;
  strengthsEyebrow: string;
  strengthsTitle: string;
  weaknessesEyebrow: string;
  weaknessesTitle: string;
  metrics: {
    asOf: string;
    revenue: string;
    netIncome: string;
    debt: string;
    freeCashFlow: string;
    ebitda: string;
    peRatio: string;
    netMargin: string;
  };
};

export type CompanyMetricCard = {
  label: string;
  value: string;
};

export type CompanyPageViewProps = {
  company: CompanyPageCompany;
  companyPageCopy: CompanyPageCopy;
  sectorOptions: StepOption[];
  language: Language;
};
