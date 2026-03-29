"use client";

import PageShell from "@/components/Base/PageShell";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function About() {
  const { copy } = useI18n();

  return (
    <PageShell align="center" density={24}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="space-y-6">
          <div>
            <p className="eyebrow">{copy.about.eyebrow}</p>
            <h1 className="mt-3 font-display text-3xl text-slate-900 sm:text-4xl">
              {copy.about.title}
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4 text-sm text-slate-600">
              {copy.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="premium-panel-soft p-6">
              <p className="eyebrow">{copy.about.visionEyebrow}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {copy.about.visionBullets.map((bullet) => (
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
