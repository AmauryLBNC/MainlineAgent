"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ThreadTone = {
  line: [number, number, number];
  glow: [number, number, number];
};

type AnimatedThreadsProps = {
  tone: ThreadTone;
  density?: number;
  speed?: number;
  className?: string;
};

type Vec3 = { x: number; y: number; z: number };

type Orb = Vec3 & {
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  phase: number;
  pulse: number;
};

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function AnimatedThreads({
  tone,
  density = 10,
  speed = 0.6,
  className,
}: AnimatedThreadsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbsRef = useRef<Orb[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let lastTime = 0;
    const dpr = window.devicePixelRatio || 1;

    const [lineR, lineG, lineB] = tone.line;
    const [glowR, glowG, glowB] = tone.glow;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      orbsRef.current = Array.from({ length: density }, () => ({
        x: rand(-width * 0.4, width * 0.4),
        y: rand(-height * 0.4, height * 0.4),
        z: rand(-400, 400),
        vx: rand(-20, 20),
        vy: rand(-20, 20),
        vz: rand(-15, 15),
        radius: rand(50, 110),
        phase: Math.random() * TAU,
        pulse: rand(0.5, 1.2),
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const perspective = 850;
      const centerX = width / 2;
      const centerY = height / 2;
      const projected: Array<{
        x: number;
        y: number;
        z: number;
        scale: number;
        radius: number;
        pulse: number;
      }> = [];

      for (const orb of orbsRef.current) {
        // mouvement autonome
        orb.x += orb.vx * dt * speed;
        orb.y += orb.vy * dt * speed;
        orb.z += orb.vz * dt * speed;

        // wrap
        if (orb.x > width / 2) orb.x = -width / 2;
        if (orb.x < -width / 2) orb.x = width / 2;
        if (orb.y > height / 2) orb.y = -height / 2;
        if (orb.y < -height / 2) orb.y = height / 2;
        if (orb.z > 400) orb.z = -400;
        if (orb.z < -400) orb.z = 400;

        const scale = perspective / (perspective + orb.z);

        const screenX = centerX + orb.x * scale;
        const screenY = centerY + orb.y * scale;

        const pulse =
          0.7 + 0.3 * Math.sin(time * 0.002 * orb.pulse + orb.phase);

        const radius = orb.radius * scale;

        projected.push({
          x: screenX,
          y: screenY,
          z: orb.z,
          scale,
          radius,
          pulse,
        });

        ctx.fillStyle = `rgba(${glowR}, ${glowG}, ${glowB}, ${
          0.16 * pulse
        })`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, TAU);
        ctx.fill();
      }

      for (let index = 0; index < projected.length; index += 1) {
        const current = projected[index];

        for (let nextIndex = index + 1; nextIndex < projected.length; nextIndex += 1) {
          const next = projected[nextIndex];
          const dx = current.x - next.x;
          const dy = current.y - next.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 220) {
            continue;
          }

          const opacity =
            (1 - distance / 220) *
            0.18 *
            Math.min(current.scale, next.scale) *
            ((current.pulse + next.pulse) / 2);

          ctx.strokeStyle = `rgba(${lineR}, ${lineG}, ${lineB}, ${opacity})`;
          ctx.lineWidth = Math.max(0.5, Math.min(current.scale, next.scale) * 1.1);
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [density, speed, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full mix-blend-plus-lighter",
        className
      )}
      aria-hidden="true"
    />
  );
}
