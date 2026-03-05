import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";
import { getUsersWithRoles } from "@/lib/data/users";
import type { UserWithRoles } from "@/lib/data/users";

export default async function AdminPage() {
  const copy = await getServerCopy();
  await requireAppAuth(PERMISSIONS.ACCESS_ADMIN);
  const users: UserWithRoles[] = await getUsersWithRoles();

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
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white/40">
                      <td className="px-5 py-4 text-foreground">
                        {user.name ?? copy.authPages.admin.unnamedUser}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {user.email ?? copy.authPages.admin.noEmail}
                      </td>
                      <td className="px-5 py-4 text-foreground">
                        {user.roles.join(", ")}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {user.permissions.join(", ")}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
