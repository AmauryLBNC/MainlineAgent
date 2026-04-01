import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";

export default async function SettingsPage() {
  const copy = await getServerCopy();
  const session = await requireAppAuth(PERMISSIONS.MANAGE_SETTINGS);

  return (
    <PageShell align="start" density={18}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {copy.authPages.settings.eyebrow}
            </p>
            <h1 className="mt-4 font-display text-4xl text-primary">
              {copy.authPages.settings.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {copy.authPages.settings.descriptionBefore}
              {` ${session.user.permissions.length} `}
              {copy.authPages.settings.descriptionAfter}
            </p>
          </section>

          <section className="rounded-[1.75rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-6 shadow-[var(--panel-shadow)] backdrop-blur">
            <h2 className="font-display text-2xl text-primary">
              {copy.authPages.settings.nextActions}
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button" variant="signin">
                {copy.authPages.settings.savePreferences}
              </Button>
              <Button type="button" variant="outline">
                {copy.authPages.settings.manageCriteria}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
