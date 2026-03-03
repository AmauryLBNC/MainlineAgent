import Link from "next/link";
import PageShell from "@/components/Base/PageShell";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <PageShell align="start" density={20}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[2rem] border border-[color:var(--panel-border)] bg-[color:var(--panel-bg)] p-8 shadow-[var(--panel-shadow)] backdrop-blur">
          <div className="space-y-3">
            <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
              403
            </p>
            <h1 className="font-display text-4xl text-primary">
              Access denied
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Your account is authenticated, but it does not have the required
              permission to access this area.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="signin">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
