import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerCopy } from "@/components/i18n/server";
import PageShell from "@/components/Base/PageShell";
import { Button } from "@/components/ui/button";
import { LoginActions } from "@/components/auth/LoginActions";
import { getAppAuthSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getAppAuthSession();
  const copy = await getServerCopy();

  if (session) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const callbackUrl = params?.callbackUrl ?? "/dashboard";
  const error = params?.error;
  const showOAuthCallbackHelp = error === "OAuthCallback";

  return (
    <PageShell align="start" density={18}>
      <div className="w-full py-20">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[linear-gradient(155deg,rgba(255,255,255,0.92),rgba(245,238,227,0.72))] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {copy.authPages.login.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl text-primary sm:text-5xl">
              {copy.authPages.login.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {copy.authPages.login.description}
              <span className="font-medium text-foreground"> /dashboard</span>.
            </p>

            {error ? (
              <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                <p>
                  {copy.authPages.login.authFailed} {error}
                </p>
                {showOAuthCallbackHelp ? (
                  <p className="mt-2 text-destructive/90">
                    {copy.authPages.login.oauthCallbackHelp}
                  </p>
                ) : null}
              </div>
            ) : null}

            <LoginActions
              callbackUrl={callbackUrl}
              signInWith={copy.authPages.login.signInWith}
              oauthLabel={copy.authPages.login.oauthLabel}
            />
          </section>

          <aside className="rounded-[2rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              {copy.authPages.login.accessModelEyebrow}
            </p>
            <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
              <p>{copy.authPages.login.defaultRole}</p>
              <p>{copy.authPages.login.autoCreateAccount}</p>
              <p>{copy.authPages.login.adminPermission}</p>
              <p>{copy.authPages.login.bootstrapAdmin}</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/">{copy.authPages.login.backHome}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
