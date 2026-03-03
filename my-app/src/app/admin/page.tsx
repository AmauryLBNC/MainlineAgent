import PageShell from "@/components/Base/PageShell";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";
import { getUsersWithRoles } from "@/lib/data/users";

export default async function AdminPage() {
  await requireAppAuth(PERMISSIONS.ACCESS_ADMIN);
  const users = await getUsersWithRoles();

  return (
    <PageShell align="start" density={16}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Admin
            </p>
            <h1 className="mt-4 font-display text-4xl text-primary">
              User directory and role assignments
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              This page is guarded by the
              <span className="font-medium text-foreground">
                {" "}
                {PERMISSIONS.ACCESS_ADMIN}
              </span>{" "}
              permission. The same permission is enforced by middleware and the
              `/api/admin/users` endpoint.
            </p>
          </section>

          <section className="overflow-hidden rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] shadow-[var(--panel-shadow)] backdrop-blur">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70 text-sm">
                <thead className="bg-white/70">
                  <tr className="text-left uppercase tracking-[0.22em] text-muted-foreground">
                    <th className="px-5 py-4 font-medium">User</th>
                    <th className="px-5 py-4 font-medium">Email</th>
                    <th className="px-5 py-4 font-medium">Roles</th>
                    <th className="px-5 py-4 font-medium">Permissions</th>
                    <th className="px-5 py-4 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white/40">
                      <td className="px-5 py-4 text-foreground">
                        {user.name ?? "Unnamed user"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {user.email ?? "No email"}
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
