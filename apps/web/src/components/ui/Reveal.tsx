"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "grow" | "fade";
  delayMs?: number;
};

export function Reveal({
  children,
  className,
  variant = "grow",
  delayMs = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenClass =
    variant === "grow" ? "opacity-0 scale-50" : "opacity-0 translate-y-3";
  const visibleClass =
    variant === "grow" ? "animate-grow-card" : "animate-fade-delayed";

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform",
        visible ? visibleClass : hiddenClass,
        className
      )}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
