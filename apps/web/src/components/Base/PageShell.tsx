"use client";

import { cn } from "@/lib/utils";
import AnimatedThreads from "@/components/ui/AnimatedThreads";

type ThreadTone = {
  line: [number, number, number];
  glow: [number, number, number];
};

type PageShellProps = {
  children: React.ReactNode;
  tone?: ThreadTone;
  density?: number;
  align?: "center" | "start";
  className?: string;
};

const DEFAULT_TONE: ThreadTone = {
  line: [118, 96, 72],
  glow: [196, 172, 140],
};

export default function PageShell({
  children,
  tone = DEFAULT_TONE,
  density = 26,
  align = "center",
  className,
}: PageShellProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen w-full px-4 sm:px-6 lg:px-10",
        className
      )}
    >
      <div className="absolute inset-0 sand-backdrop" />
      <div className="absolute inset-0 sand-haze opacity-70" />
      <AnimatedThreads
        tone={tone}
        density={density}
        speed={0.45}
        className="opacity-30"
      />
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-screen max-w-[1100px] pb-16 pt-28",
          align === "start" ? "items-start" : "items-center"
        )}
      >
        {children}
      </div>
    </section>
  );
}
