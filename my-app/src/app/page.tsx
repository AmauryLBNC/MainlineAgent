"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedThreads from "@/components/ui/AnimatedThreads";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";
import { cn } from "@/lib/utils";
//permet de voir si lutilisateur va vers le haut ou vers le bas mais je ne sais pas pourquoi c est utile
//!!
type Direction = "down" | "up";
//!!
type ThreadTone = {
  line: [number, number, number];
  glow: [number, number, number];
};
//!!
type SectionShellProps = {
  id: SectionId;
  tone: ThreadTone;
  children: React.ReactNode;
  density?: number;
  animate?: boolean;
  contentClassName?: string;
};
//type pour repertorie les param des quizz
type QuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  note: string;
};
// variable permettant de gerer le temps de rotation entre les pages
const ROTATE_INTERVAL = 10000;
// permet d avoir l index des pages en type record
const SECTION_INDEX: Record<SectionId, number> = {
  momo: 0,
  buffett: 1,
  company: 2,
  quiz: 3,
  agentgame: 4,
};
//!!
const THREAD_THEMES: ThreadTone[] = [
  { line: [118, 96, 72], glow: [196, 172, 140] },
  { line: [112, 98, 86], glow: [188, 168, 148] },
  { line: [124, 104, 86], glow: [204, 184, 156] },
  { line: [110, 96, 78], glow: [190, 170, 145] },
  { line: [120, 98, 74], glow: [200, 178, 146] },
];
//fonction principale de tout
export default function Home() {
  const { copy } = useI18n();
  const [active, setActive] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [animStage, setAnimStage] = useState<"idle" | "pre" | "run">("idle");
  const [locked, setLocked] = useState(false);
  const [rotationPaused, setRotationPaused] = useState(false);
  const pausedByQuiz = useRef(false);
  const wheelAccum = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchAccum = useRef(0);
  const lastActivity = useRef(0);
  const idleTimer = useRef<number | null>(null);
  const activeRef = useRef(active);
  const lockedRef = useRef(locked);
  const rotationPausedRef = useRef(rotationPaused);

  const totalSections = 5;
  const quizIndex = SECTION_INDEX.quiz;
  //gere les debut de la transition
  const startTransition = useCallback((dir: Direction, target: number) => {
    //si c est locked ou que la target est current alors avorter la transition
    //??
    if (lockedRef.current || target === activeRef.current) return;
    //si current est quizzindex et target n est pas quizzindex et il y a une pause par le quizz
    //alors end de paused by quizz et de la pause de rotation
    if (
      activeRef.current === quizIndex &&
      target !== quizIndex &&
      pausedByQuiz.current
    ) {
      pausedByQuiz.current = false;
      rotationPausedRef.current = false;
      setRotationPaused(false);
    }

    //!!
    lockedRef.current = true;
    setLocked(true);
    setDirection(dir);
    setIncoming(target);
    setAnimStage("pre");

    //!!
    requestAnimationFrame(() => {
      setAnimStage("run");
      setTimeout(() => {
        activeRef.current = target;
        setActive(target);
        setIncoming(null);
        setAnimStage("idle");
        lockedRef.current = false;
        setLocked(false);
      }, 950);
    });
  }, [quizIndex]);
  //!!
  useEffect(() => {
    activeRef.current = active;
    lockedRef.current = locked;
    rotationPausedRef.current = rotationPaused;
  }, [active, locked, rotationPaused]);
  //recupere la date
  useEffect(() => {
    lastActivity.current = Date.now();
  }, []);
  //!!
  const scheduleAutoRotate = useCallback(() => {
    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
    }
    if (rotationPausedRef.current) return;
    //!!
    const tick = () => {
      if (rotationPausedRef.current) return;

      const now = Date.now();
      if (!lockedRef.current && now - lastActivity.current >= ROTATE_INTERVAL) {
        lastActivity.current = now;
        const next = (activeRef.current + 1) % totalSections;
        startTransition("down", next);
      }

      idleTimer.current = window.setTimeout(tick, ROTATE_INTERVAL);
    };

    const elapsed = Date.now() - lastActivity.current;
    const remaining = Math.max(0, ROTATE_INTERVAL - elapsed);
    idleTimer.current = window.setTimeout(tick, remaining);
  }, [startTransition, totalSections]);
  //gere l auto transition mais je ne sais pas comment cela marche
  const registerActivity = useCallback(() => {
    lastActivity.current = Date.now();
    scheduleAutoRotate();
  }, [scheduleAutoRotate]);
  // si la rotaion est active alors quitter la fonciton sinon mettre a true cette rotation paused by quizz a true et apres je ne sais pas
  //!!
  const handleQuizInteract = useCallback(() => {
    if (rotationPausedRef.current) return;
    rotationPausedRef.current = true;
    pausedByQuiz.current = true;
    registerActivity();
    setRotationPaused(true);
  }, [registerActivity]);
  //gere la sortie du quizz on fini la puase de rotation la pause de quizz on recuperere la date pour a derniere activite set a false la pause prend la suivante page avec le nombre de page pour pas depasser 
  const handleQuizExit = useCallback(() => {
    rotationPausedRef.current = false;
    lastActivity.current = Date.now();
    pausedByQuiz.current = false;
    setRotationPaused(false);
    const next = (quizIndex + 1) % totalSections;
    startTransition("down", next);
    registerActivity();
  }, [quizIndex, registerActivity, startTransition, totalSections]);

  const handleQuizComplete = useCallback(() => {
    if (!rotationPausedRef.current) return;
    rotationPausedRef.current = false;
    lastActivity.current = Date.now();
    pausedByQuiz.current = false;
    setRotationPaused(false);
    registerActivity();
  }, [registerActivity]);

  useEffect(() => {
    const handleSection = (event: Event) => {
      const { detail } = event as CustomEvent<SectionId>;
      const target = SECTION_INDEX[detail];
      if (target === undefined) return;
      if (lockedRef.current || target === activeRef.current) return;
      registerActivity();
      startTransition(target > activeRef.current ? "down" : "up", target);
    };

    window.addEventListener(SECTION_EVENT, handleSection as EventListener);
    return () =>
      window.removeEventListener(SECTION_EVENT, handleSection as EventListener);
  }, [registerActivity, startTransition]);

  useEffect(() => {
    scheduleAutoRotate();

    const handlePointerMove = () => {
      registerActivity();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (idleTimer.current) {
        window.clearTimeout(idleTimer.current);
      }
    };
  }, [registerActivity, scheduleAutoRotate]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      registerActivity();
      if (lockedRef.current) {
        wheelAccum.current = 0;
        event.preventDefault();
        return;
      }

      wheelAccum.current += event.deltaY;
      const threshold = 120;
      if (Math.abs(wheelAccum.current) < threshold) {
        return;
      }

      const direction = wheelAccum.current > 0 ? "down" : "up";
      const target =
        direction === "down"
          ? (activeRef.current + 1) % totalSections
          : (activeRef.current - 1 + totalSections) % totalSections;
      wheelAccum.current = 0;
      startTransition(direction, target);
      event.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [registerActivity, startTransition, totalSections]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      touchStartY.current = touch?.clientY ?? 0;
      touchStartX.current = touch?.clientX ?? 0;
      registerActivity();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (lockedRef.current) {
        touchAccum.current = 0;
        return;
      }

      const touch = event.touches[0];
      const currentY = touch?.clientY ?? 0;
      const currentX = touch?.clientX ?? 0;
      const deltaY = touchStartY.current - currentY;
      const deltaX = touchStartX.current - currentX;

      if (Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }

      touchAccum.current = deltaY;
      const threshold = 90;
      if (Math.abs(touchAccum.current) < threshold) {
        return;
      }

      const direction = touchAccum.current > 0 ? "down" : "up";
      const target =
        direction === "down"
          ? (activeRef.current + 1) % totalSections
          : (activeRef.current - 1 + totalSections) % totalSections;
      touchAccum.current = 0;
      startTransition(direction, target);
      event.preventDefault();
    };

    const handleTouchEnd = () => {
      touchAccum.current = 0;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [registerActivity, startTransition, totalSections]);

  const getTransform = (index: number) => {
    if (animStage === "idle") {
      return index === active ? "translateY(0%)" : "translateY(100%)";
    }

    if (animStage === "pre") {
      if (index === active) return "translateY(0%)";
      if (index === incoming) {
        return direction === "down" ? "translateY(100%)" : "translateY(-100%)";
      }
      return "translateY(100%)";
    }

    if (index === active) {
      return direction === "down" ? "translateY(-100%)" : "translateY(100%)";
    }
    if (index === incoming) return "translateY(0%)";
    return "translateY(100%)";
  };

  const transition =
    animStage === "run"
      ? "transform 0.95s cubic-bezier(0.22, 0.7, 0.26, 1)"
      : "none";

  const sections = [
    <PromoMomo
      key="momo"
      tone={THREAD_THEMES[0]}
      animate={active === 0 || incoming === 0}
      content={copy.home.promoMomo}
    />,
    <WarrenBuffett
      key="buffett"
      tone={THREAD_THEMES[1]}
      animate={active === 1 || incoming === 1}
      content={copy.home.buffett}
    />,
    <CompanyProfile
      key="company"
      tone={THREAD_THEMES[2]}
      animate={active === 2 || incoming === 2}
      content={copy.home.company}
    />,
    <FinanceQuiz
      key={`quiz-${copy.home.quiz.title}`}
      tone={THREAD_THEMES[3]}
      animate={active === 3 || incoming === 3}
      rotationPaused={rotationPaused}
      content={copy.home.quiz}
      onInteract={handleQuizInteract}
      onComplete={handleQuizComplete}
      onExit={handleQuizExit}
    />,
    <AgentGame
      key="agentgame"
      tone={THREAD_THEMES[4]}
      animate={active === 4 || incoming === 4}
      content={copy.home.agentgame}
    />,
  ];

  return (
    <main className="relative h-screen overflow-hidden text-foreground" id="top">
      {sections.map((section, idx) => (
        <div
          key={idx}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: getTransform(idx),
            transition,
          }}
        >
          {section}
        </div>
      ))}
    </main>
  );
}

function SectionShell({
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

type PromoMomoContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

type WarrenBuffettContent = {
  eyebrow: string;
  quote: string;
  quoteBy: string;
  paragraphs: string[];
  essentialsEyebrow: string;
  essentialsTitle: string;
  essentials: string[];
  footer: string;
};

type CompanyProfileContent = {
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

type FinanceQuizContent = {
  eyebrow: string;
  title: string;
  description: string;
  pausedStatus: string;
  runningStatus: string;
  correctLabel: string;
  reviewLabel: string;
  resultLabel: string;
  completedMessage: string;
  pendingMessage: string;
  longQuizCta: string;
  exitCta: string;
  questions: QuizQuestion[];
};

type AgentGameContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  receiveEyebrow: string;
  receiveBullets: string[];
};

function PromoMomo({
  tone,
  animate,
  content,
}: {
  tone: ThreadTone;
  animate: boolean;
  content: PromoMomoContent;
}) {
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

function WarrenBuffett({
  tone,
  animate,
  content,
}: {
  tone: ThreadTone;
  animate: boolean;
  content: WarrenBuffettContent;
}) {
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

function CompanyProfile({
  tone,
  animate,
  content,
}: {
  tone: ThreadTone;
  animate: boolean;
  content: CompanyProfileContent;
}) {
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

function FinanceQuiz({
  tone,
  animate,
  rotationPaused,
  content,
  onInteract,
  onComplete,
  onExit,
}: {
  tone: ThreadTone;
  animate: boolean;
  rotationPaused: boolean;
  content: FinanceQuizContent;
  onInteract: () => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    content.questions.map(() => null)
  );

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
    onInteract();
  };

  const score = answers.reduce<number>((total, answer, idx) => {
    if (answer === content.questions[idx]?.correct) return total + 1;
    return total;
  }, 0);

  const completed = answers.every((answer) => answer !== null);

  useEffect(() => {
    if (completed && rotationPaused) {
      onComplete();
    }
  }, [completed, onComplete, rotationPaused]);

  return (
    <SectionShell
      id="quiz"
      tone={tone}
      animate={animate}
      density={28}
      contentClassName="items-start"
    >
      <div
        className="premium-panel flex max-h-[calc(100dvh-9rem)] w-full flex-col overflow-hidden px-8 py-10 sm:px-12 sm:py-12"
        onPointerDown={onInteract}
        onFocusCapture={onInteract}
      >
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              {content.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {content.description}
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            {rotationPaused ? content.pausedStatus : content.runningStatus}
          </div>
        </div>

        <div className="mt-8 flex min-h-0 flex-1 overflow-hidden">
          <div
            className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto overscroll-contain pr-4 -mr-2"
            data-quiz-scroll="true"
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="space-y-6">
              {content.questions.map((question, questionIndex) => {
                const selected = answers[questionIndex];
                return (
                  <div key={question.prompt} className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {questionIndex + 1}. {question.prompt}
                    </p>
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isAnswered = selected !== null;
                        const isCorrect = question.correct === optionIndex;
                        const showCorrect = isAnswered && isCorrect;
                        const showWrong = isAnswered && isSelected && !isCorrect;
                        return (
                          <button
                            key={option}
                            type="button"
                            className={cn(
                              "quiz-option",
                              isSelected && "is-selected",
                              showCorrect && "is-correct",
                              showWrong && "is-wrong"
                            )}
                            onClick={() => handleSelect(questionIndex, optionIndex)}
                            aria-pressed={isSelected}
                          >
                            <span>{option}</span>
                            {isAnswered ? (
                              <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                {isCorrect
                                  ? content.correctLabel
                                  : isSelected
                                    ? content.reviewLabel
                                    : ""}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    {selected !== null ? (
                      <p className="text-xs text-slate-500">{question.note}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="soft-divider my-8" />

            <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  {content.resultLabel}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {score}/{content.questions.length}
                </p>
                <p className="text-sm text-slate-600">
                  {completed
                    ? content.completedMessage
                    : content.pendingMessage}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="cta-soft shadow-none hover:shadow-none"
                >
                  <Link href="/quiz/free">{content.longQuizCta}</Link>
                </Button>
                {rotationPaused ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="cta-soft shadow-none hover:shadow-none"
                    onClick={onExit}
                  >
                    {content.exitCta}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function AgentGame({
  tone,
  animate,
  content,
}: {
  tone: ThreadTone;
  animate: boolean;
  content: AgentGameContent;
}) {
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
