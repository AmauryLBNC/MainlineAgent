import { notFound } from "next/navigation";
import { getServerCopy, getServerLanguage } from "@/components/i18n/server";
import { getAppAuthSession } from "@/lib/auth/session";
import { getCompanyPageCompany } from "./actions";
import { CompanyPageView } from "./components/CompanyPageView";
import type { CompanyPageProps } from "./types";

export default async function CompanyPage({ params }: CompanyPageProps) {
  const [{ slug }, copy, language, session] = await Promise.all([
    params,
    getServerCopy(),
    getServerLanguage(),
    getAppAuthSession(),
  ]);

  const company = await getCompanyPageCompany(slug, session?.user.id);

  if (!company) {
    notFound();
  }

  return (
    <CompanyPageView
      company={company}
      companyPageCopy={copy.momoia.companyPage}
      sectorOptions={copy.momoia.steps.items[0]?.options ?? []}
      language={language}
    />
  );
}
