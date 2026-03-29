import { SectionShell, type ThreadTone } from "./SectionShell";

export type CompanyProfileContent = {
  profileEyebrow: string;
  name: string;
  demoDataLabel: string;
  profileLines: string[];
  ceoEyebrow: string;
  ceoName: string;
  ceoDescription: string;
  ceoBullets: string[];
  toolsEyebrow: string;
  metrics: Array<{ label: string; value: string }>;
  perEyebrow: string;
  perDescription: string;
  perBullets: string[];
};

type CompanyProfileProps = {
  tone: ThreadTone;
  animate: boolean;
  content: CompanyProfileContent;
};

export function CompanyProfile({
  tone,
  animate,
  content,
}: CompanyProfileProps) {
  return (
    <SectionShell id="company" tone={tone} animate={animate} density={26}>
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="premium-panel p-8 sm:p-10">
            <p className="eyebrow">{content.profileEyebrow}</p>
            <h2 className="mt-4 font-display text-3xl text-slate-900">
              {content.name}
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-500">
              {content.demoDataLabel}
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              {content.profileLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="premium-panel-soft p-7 sm:p-9">
            <p className="eyebrow">{content.ceoEyebrow}</p>
            <h3 className="mt-3 font-display text-2xl text-slate-900">
              {content.ceoName}
            </h3>
            <p className="mt-3 text-sm text-slate-600">{content.ceoDescription}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {content.ceoBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-panel p-7 sm:p-9">
            <p className="eyebrow">{content.toolsEyebrow}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {content.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[rgba(120,105,85,0.18)] bg-white/65 px-4 py-3"
                >
                  <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-panel-soft p-7 sm:p-9">
            <p className="eyebrow">{content.perEyebrow}</p>
            <p className="mt-3 text-sm text-slate-600">{content.perDescription}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {content.perBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
