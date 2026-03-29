import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionShell, type ThreadTone } from "./SectionShell";

export type AgentGameContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  receiveEyebrow: string;
  receiveBullets: string[];
};

type AgentGameProps = {
  tone: ThreadTone;
  animate: boolean;
  content: AgentGameContent;
};

export function AgentGame({ tone, animate, content }: AgentGameProps) {
  return (
    <SectionShell id="agentgame" tone={tone} animate={animate} density={30}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="font-display text-3xl text-slate-900 sm:text-4xl">
              {content.title}
            </h2>
            <p className="text-base text-slate-600">{content.description}</p>
            <Button
              asChild
              variant="outline"
              className="cta-soft shadow-none hover:shadow-none"
            >
              <Link href="/signup">{content.cta}</Link>
            </Button>
          </div>
          <div className="premium-panel-soft p-6 sm:p-8">
            <p className="eyebrow">{content.receiveEyebrow}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {content.receiveBullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
