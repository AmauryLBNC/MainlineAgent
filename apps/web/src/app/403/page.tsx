import { getServerCopy } from "@/components/i18n/server";
import { AccessDenied } from "@/components/auth/AccessDenied";

export default async function ForbiddenPage() {
  const copy = await getServerCopy();

  return (
    <AccessDenied
      title={copy.authPages.accessDenied.title}
      description={copy.authPages.accessDenied.description}
      backToDashboard={copy.authPages.accessDenied.backToDashboard}
      returnHome={copy.authPages.accessDenied.returnHome}
    />
  );
}
