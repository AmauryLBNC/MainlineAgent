"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function AgentGame() {
  const { copy } = useI18n();

  return (
    <PageShell density={26}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="eyebrow">{copy.agentgamePage.eyebrow}</p>
            <h1 className="font-display text-3xl text-slate-900 sm:text-4xl">
              {copy.agentgamePage.title}
            </h1>
            <p className="text-base text-slate-600">
              {copy.agentgamePage.description}
            </p>
            <Button
              asChild
              variant="outline"
              className="cta-soft shadow-none hover:shadow-none"
            >
              <Link href="/signup">{copy.agentgamePage.cta}</Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="premium-panel-soft p-6">
              <p className="eyebrow">{copy.agentgamePage.yourAnalysis.eyebrow}</p>
              <h2 className="mt-3 font-display text-xl text-slate-900">
                {copy.agentgamePage.yourAnalysis.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {copy.agentgamePage.yourAnalysis.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {copy.agentgamePage.yourAnalysis.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="premium-panel-soft p-6">
              <p className="eyebrow">{copy.agentgamePage.aiFeedback.eyebrow}</p>
              <h2 className="mt-3 font-display text-xl text-slate-900">
                {copy.agentgamePage.aiFeedback.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {copy.agentgamePage.aiFeedback.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {copy.agentgamePage.aiFeedback.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
