import Link from "next/link";
import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";
import { Button } from "@/components/ui/button";


export default async function DashboardPage() {
  const copy = await getServerCopy();
 
  return (
    <PageShell align="start" density={22}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {copy.authPages.dashboard.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl text-primary">
              {copy.authPages.dashboard.welcomeBack}

            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {copy.authPages.dashboard.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.authPages.dashboard.email}
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.authPages.dashboard.roles}
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                </p>
              </article>
              <article className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {copy.authPages.dashboard.permissions}
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">
                </p>
              </article>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                {copy.authPages.dashboard.sessionPayload}
              </h2>
              <pre className="mt-4 overflow-x-auto rounded-2xl bg-primary/95 p-4 text-xs leading-6 text-primary-foreground">
              </pre>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                {copy.authPages.dashboard.quickLinks}
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="signin">
                  <Link href="/profile">{copy.authPages.dashboard.profile}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/settings">
                    {copy.authPages.dashboard.settings}
                  </Link>
                </Button>

              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
