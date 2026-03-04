import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";
import { getUserSnapshot } from "@/lib/data/users";

export default async function ProfilePage() {
  const copy = await getServerCopy();
  const session = await requireAppAuth(PERMISSIONS.VIEW_PROFILE);
  const profile = await getUserSnapshot(session.user.id);

  return (
    <PageShell align="start" density={20}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {copy.authPages.profile.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl text-primary">
              {copy.authPages.profile.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {copy.authPages.profile.description}
            </p>
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                {copy.authPages.profile.identity}
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="uppercase tracking-[0.25em] text-muted-foreground">
                    {copy.authPages.profile.name}
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {profile?.name ??
                      session.user.name ??
                      copy.authPages.profile.notProvided}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.25em] text-muted-foreground">
                    {copy.authPages.profile.email}
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {profile?.email ??
                      session.user.email ??
                      copy.authPages.profile.notProvided}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[0.25em] text-muted-foreground">
                    {copy.authPages.profile.connectedProviders}
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {profile?.accounts.length
                      ? profile.accounts
                          .map((account) => account.provider)
                          .join(", ")
                      : copy.authPages.profile.noProviderMetadata}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
              <h2 className="font-display text-2xl text-primary">
                {copy.authPages.profile.effectiveAuthorization}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.25rem] border border-border/70 bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {copy.authPages.profile.roles}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    {profile?.roles.join(", ") ?? session.user.roles.join(", ")}
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-border/70 bg-white/60 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {copy.authPages.profile.permissions}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    {(profile?.permissions ?? session.user.permissions).join(
                      ", "
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
