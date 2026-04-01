import type { ReactNode } from "react";
import AnimatedThreads from "@/components/ui/AnimatedThreads";
import type { SectionId } from "@/lib/section-navigation";
import { cn } from "@/lib/utils";

export type ThreadTone = {
  line: [number, number, number];
  glow: [number, number, number];
};

export type SectionShellProps = {
  id: SectionId;
  tone: ThreadTone;
  children: ReactNode;
  density?: number;
  animate?: boolean;
  contentClassName?: string;
};

export const HOME_THREAD_THEMES: ThreadTone[] = [
  { line: [118, 96, 72], glow: [196, 172, 140] },
  { line: [112, 98, 86], glow: [188, 168, 148] },
  { line: [124, 104, 86], glow: [204, 184, 156] },
  { line: [110, 96, 78], glow: [190, 170, 145] },
  { line: [120, 98, 74], glow: [200, 178, 146] },
];

export function SectionShell({
  id,
  tone,
  children,
  density = 26,
  animate = true,
  contentClassName,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className="relative min-h-screen w-full px-4 sm:px-6 lg:px-10"
    >
      <div className="absolute inset-0 sand-backdrop" />
      <div className="absolute inset-0 sand-haze opacity-70" />
      {animate ? (
        <AnimatedThreads
          tone={tone}
          density={density}
          speed={0.45}
          className="opacity-30"
        />
      ) : null}
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-screen max-w-[1100px] items-center pb-16 pt-28",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
