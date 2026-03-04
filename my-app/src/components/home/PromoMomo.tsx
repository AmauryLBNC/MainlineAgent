import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionShell, type ThreadTone } from "./SectionShell";

export type PromoMomoContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

type PromoMomoProps = {
  tone: ThreadTone;
  animate: boolean;
  content: PromoMomoContent;
};

export function PromoMomo({ tone, animate, content }: PromoMomoProps) {
  return (
    <SectionShell id="momo" tone={tone} animate={animate} density={30}>
      <div className="premium-panel w-full px-8 py-12 text-center sm:px-12 sm:py-14">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {content.title}
        </h1>
        <p className="mt-5 text-base text-slate-600 sm:text-lg">
          {content.description}
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Button
            asChild
            variant="outline"
            className="cta-soft shadow-none hover:shadow-none"
          >
            <Link href="/quiz/free">{content.cta}</Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
