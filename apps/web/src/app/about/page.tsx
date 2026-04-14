"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function About() {
  const { copy } = useI18n();

  return (
    <PageShell align="center" density={24}>
      <div className="w-full py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.about.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.about.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
              {copy.about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="app-copy text-sm leading-7 sm:text-base">
                  {paragraph}
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                {copy.about.visionEyebrow}
              </Badge>
            </CardHeader>
            <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
              {copy.about.visionBullets.map((bullet, index) => (
                <div key={bullet} className="app-choice rounded-2xl px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="rounded-full px-2.5">
                      {index + 1}
                    </Badge>
                    <p className="app-copy text-sm leading-7">{bullet}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
