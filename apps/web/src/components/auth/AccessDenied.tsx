import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageShell from "@/components/Base/PageShell";

type AccessDeniedProps = {
  title: string;
  description: string;
  backToDashboard: string;
  returnHome: string;
};

export function AccessDenied({
  title,
  description,
  backToDashboard,
  returnHome,
}: AccessDeniedProps) {
  return (
    <PageShell align="start" density={20}>
      <div className="w-full py-20">
        <div className="mx-auto max-w-3xl">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="destructive" className="w-fit rounded-full px-3 py-1">
                403
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
              <p className="app-copy max-w-2xl text-sm leading-7 sm:text-base">
                {description}
              </p>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-5">
                  <Link href="/dashboard">{backToDashboard}</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link href="/">{returnHome}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
