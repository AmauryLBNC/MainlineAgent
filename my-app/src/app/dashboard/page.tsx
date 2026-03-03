import Link from "next/link";
import PageShell from "@/components/Base/PageShell";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireAppAuth(PERMISSIONS.VIEW_DASHBOARD);
  const canAccessAdmin = session.user.permissions.includes(
    PERMISSIONS.ACCESS_ADMIN
  );

  return (
    <PageShell align="start" density={22}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-4 font-display text-4xl text-primary">
              Welcome back{session.user.name ? `, ${session.user.name}` : ""}.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Your session is powered by JWT, while roles and permissions are
              loaded from PostgreSQL via Prisma on sign-in.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {session.user.email ?? "No email available"}
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Roles
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {session.user.roles.join(", ")}
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Permissions
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {session.user.permissions.length}
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                Session payload
              </h2>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-primary/95 p-4 text-xs leading-6 text-primary-foreground">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                Quick links
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="signin">
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/settings">Settings</Link>
                </Button>
                {canAccessAdmin ? (
                  <Button asChild variant="outline">
                    <Link href="/admin">Admin</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
