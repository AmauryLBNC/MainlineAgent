import { getServerCopy } from "@/components/i18n/server";

export default async function ForbiddenPage() {
  const copy = await getServerCopy();

  return (
    <div>403</div>
  );
}
