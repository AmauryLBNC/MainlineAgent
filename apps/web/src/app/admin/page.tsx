import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";


export default async function AdminPage() {
  const copy = await getServerCopy();

  return (
    <PageShell align="start" density={16}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
         

          <section className="overflow-hidden rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] shadow-[var(--panel-shadow)] backdrop-blur">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70 text-sm">
                <thead className="bg-white/70">
                  <tr className="text-left uppercase tracking-[0.22em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">
                      {copy.authPages.admin.user}
                    </th>
                    <th className="px-5 py-4 font-medium">
                      {copy.authPages.admin.email}
                    </th>
                    <th className="px-5 py-4 font-medium">
                      {copy.authPages.admin.roles}
                    </th>
                    <th className="px-5 py-4 font-medium">
                      {copy.authPages.admin.permissions}
                    </th>
                    <th className="px-5 py-4 font-medium">
                      {copy.authPages.admin.created}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">

                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
