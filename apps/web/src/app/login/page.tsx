import Link from "next/link";
import { redirect } from "next/navigation";
import { RiShieldCheckLine } from "@remixicon/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageShell from "@/components/Base/PageShell";
import { LoginActions } from "@/components/auth/LoginActions";
import { getServerCopy } from "@/components/i18n/server";
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
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.authPages.login.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.authPages.login.title}
              </CardTitle>
              <p className="app-copy max-w-3xl text-sm leading-7 sm:text-base">
                {copy.authPages.login.description}
                <span className="font-semibold text-foreground"> /dashboard</span>.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
              {error ? (
                <Alert variant="destructive" className="rounded-2xl">
                  <AlertTitle>
                    {copy.authPages.login.authFailed} {error}
                  </AlertTitle>
                  {showOAuthCallbackHelp ? (
                    <AlertDescription>
                      {copy.authPages.login.oauthCallbackHelp}
                    </AlertDescription>
                  ) : null}
                </Alert>
              ) : null}

              <LoginActions
                callbackUrl={callbackUrl}
                signInWith={copy.authPages.login.signInWith}
                oauthLabel={copy.authPages.login.oauthLabel}
              />
            </CardContent>
          </Card>

          <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <RiShieldCheckLine className="size-5" />
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {copy.authPages.login.accessModelEyebrow}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 sm:px-8 sm:pb-8">
              {[
                copy.authPages.login.defaultRole,
                copy.authPages.login.autoCreateAccount,
                copy.authPages.login.adminPermission,
                copy.authPages.login.bootstrapAdmin,
              ].map((item) => (
                <div key={item} className="app-choice rounded-2xl px-4 py-4">
                  <p className="app-copy text-sm leading-7">{item}</p>
                </div>
              ))}

              <div className="pt-2">
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/">{copy.authPages.login.backHome}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
