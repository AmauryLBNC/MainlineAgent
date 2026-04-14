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
  const [glowR, glowG, glowB] = tone.glow;

  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-10",
        className
      )}
    >
      <div className="absolute inset-0 app-backdrop" />
      <div className="absolute inset-0 app-grid opacity-65" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 50% 8%, rgba(${glowR}, ${glowG}, ${glowB}, 0.18), transparent 38%)`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
      <AnimatedThreads
        tone={tone}
        density={density}
        speed={0.45}
        className="opacity-55"
      />
      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-screen max-w-7xl pb-16 pt-28 sm:pt-32",
          align === "start" ? "items-start" : "items-center"
        )}
      >
        {children}
      </div>
    </section>
  );
}
