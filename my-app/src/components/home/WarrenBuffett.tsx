import { SectionShell, type ThreadTone } from "./SectionShell";

export type WarrenBuffettContent = {
  eyebrow: string;
  quote: string;
  quoteBy: string;
  paragraphs: string[];
  essentialsEyebrow: string;
  essentialsTitle: string;
  essentials: string[];
  footer: string;
};

type WarrenBuffettProps = {
  tone: ThreadTone;
  animate: boolean;
  content: WarrenBuffettContent;
};

export function WarrenBuffett({
  tone,
  animate,
  content,
}: WarrenBuffettProps) {
  return (
    <SectionShell id="buffett" tone={tone} animate={animate} density={24}>
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="premium-panel p-8 sm:p-10">
          <p className="eyebrow">{content.eyebrow}</p>
          <blockquote className="mt-6 font-display text-2xl leading-relaxed text-slate-900 sm:text-3xl">
            {content.quote}
          </blockquote>
          <p className="mt-4 text-sm text-slate-500">{content.quoteBy}</p>
          <div className="mt-8 space-y-3 text-sm text-slate-600">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="premium-panel-soft p-7 sm:p-9">
          <p className="eyebrow">{content.essentialsEyebrow}</p>
          <h2 className="mt-4 font-display text-2xl text-slate-900">
            {content.essentialsTitle}
          </h2>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            {content.essentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-6 soft-divider" />
          <p className="mt-5 text-sm text-slate-600">{content.footer}</p>
        </div>
      </div>
    </SectionShell>
  );
}
