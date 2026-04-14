import Link from "next/link";
import { RiArrowRightLine, RiRobot2Line } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="app-panel rounded-[2rem] border-0 py-0">
          <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {content.eyebrow}
            </Badge>
            <CardTitle className="app-title text-4xl sm:text-5xl">
              {content.title}
            </CardTitle>
            <p className="app-copy max-w-2xl text-base leading-7 sm:text-lg">
              {content.description}
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/login?callbackUrl=/agentgame">
                {content.cta}
                <RiArrowRightLine />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
          <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <RiRobot2Line className="size-5" />
              </div>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {content.receiveEyebrow}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
            {content.receiveBullets.map((bullet, index) => (
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
    </SectionShell>
  );
}
