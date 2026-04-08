"use client";

import Link from "next/link";
import { RiArrowRightLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function AgentGame() {
  const { copy } = useI18n();

  return (
    <PageShell density={26}>
      <div className="w-full py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.agentgamePage.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.agentgamePage.title}
              </CardTitle>
              <p className="app-copy max-w-2xl text-sm leading-7 sm:text-base">
                {copy.agentgamePage.description}
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/login?callbackUrl=/agentgame">
                  {copy.agentgamePage.cta}
                  <RiArrowRightLine />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
              <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                  {copy.agentgamePage.yourAnalysis.eyebrow}
                </Badge>
                <CardTitle className="app-title text-2xl sm:text-3xl">
                  {copy.agentgamePage.yourAnalysis.title}
                </CardTitle>
                <p className="app-copy text-sm leading-7">
                  {copy.agentgamePage.yourAnalysis.description}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
                {copy.agentgamePage.yourAnalysis.bullets.map((bullet) => (
                  <div key={bullet} className="app-choice rounded-2xl px-4 py-4">
                    <p className="app-copy text-sm leading-7">{bullet}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
              <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
                  {copy.agentgamePage.aiFeedback.eyebrow}
                </Badge>
                <CardTitle className="app-title text-2xl sm:text-3xl">
                  {copy.agentgamePage.aiFeedback.title}
                </CardTitle>
                <p className="app-copy text-sm leading-7">
                  {copy.agentgamePage.aiFeedback.description}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
                {copy.agentgamePage.aiFeedback.bullets.map((bullet) => (
                  <div key={bullet} className="app-choice rounded-2xl px-4 py-4">
                    <p className="app-copy text-sm leading-7">{bullet}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
