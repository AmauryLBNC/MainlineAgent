"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedThreads from "@/components/ui/AnimatedThreads";
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";
import { cn } from "@/lib/utils";

type Direction = "down" | "up";

type ThreadTone = {
  line: [number, number, number];
  glow: [number, number, number];
};

type SectionShellProps = {
  id: SectionId;
  tone: ThreadTone;
  children: React.ReactNode;
  density?: number;
  animate?: boolean;
};

type QuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  note: string;
};

const ROTATE_INTERVAL = 10000;

const SECTION_INDEX: Record<SectionId, number> = {
  momo: 0,
  buffett: 1,
  company: 2,
  quiz: 3,
  agentgame: 4,
};

const THREAD_THEMES: ThreadTone[] = [
  { line: [118, 96, 72], glow: [196, 172, 140] },
  { line: [112, 98, 86], glow: [188, 168, 148] },
  { line: [124, 104, 86], glow: [204, 184, 156] },
  { line: [110, 96, 78], glow: [190, 170, 145] },
  { line: [120, 98, 74], glow: [200, 178, 146] },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    prompt:
      "Quel indicateur mesure la rentabilite d'une entreprise par rapport a ses capitaux propres ?",
    options: ["Marge brute", "ROE (Return on Equity)", "PER", "EBITDA"],
    correct: 1,
    note: "Le ROE compare le resultat net aux capitaux propres.",
  },
  {
    prompt: "Que signifie generalement un PER eleve ?",
    options: [
      "Le marche anticipe une croissance forte ou valorise cher les benefices",
      "L'entreprise n'a pas de dette",
      "Les dividendes sont assures",
      "Le chiffre d'affaires est en baisse",
    ],
    correct: 0,
    note:
      "Un PER eleve reflete souvent des attentes de croissance ou une valorisation exigeante.",
  },
  {
    prompt: "Quel est l'effet principal de la diversification d'un portefeuille ?",
    options: [
      "Augmenter le levier",
      "Reduire le risque specifique",
      "Garantir le rendement",
      "Eviter toute volatilite",
    ],
    correct: 1,
    note: "La diversification limite l'impact d'un risque propre a un seul actif.",
  },
  {
    prompt: "Qu'est-ce qu'une obligation ?",
    options: [
      "Une part de capital",
      "Un titre de dette avec un coupon",
      "Un derive de change",
      "Une action privilegiee",
    ],
    correct: 1,
    note: "Une obligation represente une dette emise par une entreprise ou un Etat.",
  },
  {
    prompt: "Quel est l'objectif principal d'un bilan ?",
    options: [
      "Prevoir les ventes futures",
      "Donner une photographie du patrimoine a une date donnee",
      "Calculer la marge operationnelle",
      "Evaluer la satisfaction client",
    ],
    correct: 1,
    note:
      "Le bilan presente les actifs, les passifs et les capitaux propres a un instant T.",
  },
];

export default function Home() {
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
  const lastActivity = useRef(Date.now());
  const idleTimer = useRef<number | null>(null);
  const activeRef = useRef(active);
  const lockedRef = useRef(locked);
  const rotationPausedRef = useRef(rotationPaused);

  const totalSections = 5;
  const quizIndex = SECTION_INDEX.quiz;

  const startTransition = useCallback((dir: Direction, target: number) => {
    if (lockedRef.current || target === activeRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setDirection(dir);
    setIncoming(target);
    setAnimStage("pre");

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
  }, []);

  useEffect(() => {
    activeRef.current = active;
    lockedRef.current = locked;
    rotationPausedRef.current = rotationPaused;
  }, [active, locked, rotationPaused]);

  const scheduleAutoRotate = useCallback(() => {
    if (idleTimer.current) {
      window.clearTimeout(idleTimer.current);
    }
    if (rotationPausedRef.current) return;

    const elapsed = Date.now() - lastActivity.current;
    const remaining = Math.max(0, ROTATE_INTERVAL - elapsed);

    idleTimer.current = window.setTimeout(() => {
      if (rotationPausedRef.current || lockedRef.current) {
        scheduleAutoRotate();
        return;
      }
      const now = Date.now();
      if (now - lastActivity.current < ROTATE_INTERVAL) {
        scheduleAutoRotate();
        return;
      }
      lastActivity.current = now;
      const next = (activeRef.current + 1) % totalSections;
      startTransition("down", next);
      scheduleAutoRotate();
    }, remaining);
  }, [startTransition, totalSections]);

  const registerActivity = useCallback(() => {
    lastActivity.current = Date.now();
    scheduleAutoRotate();
  }, [scheduleAutoRotate]);

  const handleQuizInteract = useCallback(() => {
    if (rotationPausedRef.current) return;
    rotationPausedRef.current = true;
    pausedByQuiz.current = true;
    registerActivity();
    setRotationPaused(true);
  }, [registerActivity]);

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
    if (active !== quizIndex && pausedByQuiz.current) {
      pausedByQuiz.current = false;
      rotationPausedRef.current = false;
      setRotationPaused(false);
      registerActivity();
    }
  }, [active, quizIndex, registerActivity]);

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
    />,
    <WarrenBuffett
      key="buffett"
      tone={THREAD_THEMES[1]}
      animate={active === 1 || incoming === 1}
    />,
    <CompanyProfile
      key="company"
      tone={THREAD_THEMES[2]}
      animate={active === 2 || incoming === 2}
    />,
    <FinanceQuiz
      key="quiz"
      tone={THREAD_THEMES[3]}
      animate={active === 3 || incoming === 3}
      rotationPaused={rotationPaused}
      onInteract={handleQuizInteract}
      onComplete={handleQuizComplete}
      onExit={handleQuizExit}
    />,
    <AgentGame
      key="agentgame"
      tone={THREAD_THEMES[4]}
      animate={active === 4 || incoming === 4}
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
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1100px] items-center pb-16 pt-28">
        {children}
      </div>
    </section>
  );
}

function PromoMomo({
  tone,
  animate,
}: {
  tone: ThreadTone;
  animate: boolean;
}) {
  return (
    <SectionShell id="momo" tone={tone} animate={animate} density={30}>
      <div className="premium-panel w-full px-8 py-12 text-center sm:px-12 sm:py-14">
        <p className="eyebrow">MomoIA</p>
        <h1 className="mt-4 font-display text-3xl leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Essayez MomoIA pour vous constituer votre liste d'investissement.
        </h1>
        <p className="mt-5 text-base text-slate-600 sm:text-lg">
          Un cadre clair pour filtrer les opportunites, ordonner les priorites et
          construire une methode d'investissement sereine.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Button
            asChild
            variant="outline"
            className="cta-soft shadow-none hover:shadow-none"
          >
            <Link href="/quiz/free">Essayer MomoIA</Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function WarrenBuffett({
  tone,
  animate,
}: {
  tone: ThreadTone;
  animate: boolean;
}) {
  return (
    <SectionShell id="buffett" tone={tone} animate={animate} density={24}>
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="premium-panel p-8 sm:p-10">
          <p className="eyebrow">Warren Buffett</p>
          <blockquote className="mt-6 font-display text-2xl leading-relaxed text-slate-900 sm:text-3xl">
            "Le prix est ce que vous payez. La valeur est ce que vous obtenez."
          </blockquote>
          <p className="mt-4 text-sm text-slate-500">- Warren Buffett</p>
          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <p>
              Investisseur ne en 1930, il a transforme Berkshire Hathaway en
              un conglomerat de reference et incarne la discipline du temps long.
            </p>
            <p>
              Son approche valorise les entreprises solides, la qualite des
              dirigeants et la capacite a generer des flux de tresorerie durables.
            </p>
          </div>
        </div>

        <div className="premium-panel-soft p-7 sm:p-9">
          <p className="eyebrow">Reperes essentiels</p>
          <h2 className="mt-4 font-display text-2xl text-slate-900">
            Une vision patiente de l'investissement
          </h2>
          <ul className="mt-5 space-y-2 text-sm text-slate-600">
            <li>Ne en 1930 a Omaha, Nebraska.</li>
            <li>President de Berkshire Hathaway depuis 1965.</li>
            <li>Philosophie : acheter des entreprises de qualite a prix raisonnable.</li>
            <li>Succes notables : GEICO, Coca-Cola, Apple.</li>
            <li>Horizon long terme et discipline sur les cycles.</li>
          </ul>
          <div className="mt-6 soft-divider" />
          <p className="mt-5 text-sm text-slate-600">
            "Le temps est l'ami des bonnes entreprises" resume l'esprit de sa
            methode : patience, rigueur et capitalisation composee.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

function CompanyProfile({
  tone,
  animate,
}: {
  tone: ThreadTone;
  animate: boolean;
}) {
  return (
    <SectionShell id="company" tone={tone} animate={animate} density={26}>
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="premium-panel p-8 sm:p-10">
            <p className="eyebrow">Fiche entreprise</p>
            <h2 className="mt-4 font-display text-3xl text-slate-900">
              Lumenis Patrimoine SA
            </h2>
            <p className="mt-2 text-xs uppercase tracking-[0.28em] text-slate-500">
              Donnees illustratives
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p>Specialiste de la gestion d'actifs europeens haut de gamme.</p>
              <p>Portefeuilles multi-actifs orientes croissance de long terme.</p>
              <p>Presence internationale avec une base clientele institutionnelle.</p>
            </div>
          </div>

          <div className="premium-panel-soft p-7 sm:p-9">
            <p className="eyebrow">CEO</p>
            <h3 className="mt-3 font-display text-2xl text-slate-900">
              Claire Duval
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Ancienne directrice des investissements chez un leader europeen,
              elle pilote Lumenis Patrimoine depuis 2018.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>15 ans d'experience en allocation strategique.</li>
              <li>Modernisation de la recherche proprietaire.</li>
              <li>Hausse structurelle des marges depuis sa prise de fonction.</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-panel p-7 sm:p-9">
            <p className="eyebrow">Outils financiers</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Chiffre d'affaires", value: "8,2 Md EUR" },
                { label: "Resultat net", value: "1,15 Md EUR" },
                { label: "Endettement", value: "2,4 Md EUR" },
                { label: "Tresorerie", value: "1,9 Md EUR" },
                { label: "PER", value: "14,2x" },
                { label: "Marge nette", value: "14,1%" },
              ].map((metric) => (
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
            <p className="eyebrow">Comprendre le PER</p>
            <p className="mt-3 text-sm text-slate-600">
              Le Price Earnings Ratio compare le prix d'une action au benefice
              net par action. Il indique combien le marche paie pour 1 euro de
              resultat.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>PER eleve : attentes de croissance ou valorisation exigeante.</li>
              <li>PER modere : valorisation plus prudente ou croissance stable.</li>
              <li>Comparer le PER a celui du secteur pour interpreter le signal.</li>
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
  onInteract,
  onComplete,
  onExit,
}: {
  tone: ThreadTone;
  animate: boolean;
  rotationPaused: boolean;
  onInteract: () => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    QUIZ_QUESTIONS.map(() => null)
  );

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
    onInteract();
  };

  const score = answers.reduce((total, answer, idx) => {
    if (total == null) total =0
    if (answer === QUIZ_QUESTIONS[idx].correct) return total + 1;
    return total;
  }, 0);

  const completed = answers.every((answer) => answer !== null);

  useEffect(() => {
    if (completed && rotationPaused) {
      onComplete();
    }
  }, [completed, onComplete, rotationPaused]);

  return (
    <SectionShell id="quiz" tone={tone} animate={animate} density={28}>
      <div
        className="premium-panel w-full space-y-8 px-8 py-10 sm:px-12 sm:py-12"
        onPointerDown={onInteract}
        onFocusCapture={onInteract}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Quiz financier</p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Testez vos fondamentaux
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cinq questions pour verifier vos reflexes d'investisseur.
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            {rotationPaused ? "Auto-rotation en pause" : "Rotation automatique"}
          </div>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((question, questionIndex) => {
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
                            {isCorrect ? "Correct" : isSelected ? "A revoir" : ""}
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

        <div className="soft-divider" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Resultat
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {score}/{QUIZ_QUESTIONS.length}
            </p>
            <p className="text-sm text-slate-600">
              {completed
                ? "Quiz termine. Prenez le temps de relire vos choix."
                : "Selectionnez une reponse par question."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="cta-soft shadow-none hover:shadow-none"
            >
              <Link href="/quiz/free">Faire un quiz plus long</Link>
            </Button>
            {rotationPaused ? (
              <Button
                type="button"
                variant="outline"
                className="cta-soft shadow-none hover:shadow-none"
                onClick={onExit}
              >
                Quitter le quiz
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function AgentGame({
  tone,
  animate,
}: {
  tone: ThreadTone;
  animate: boolean;
}) {
  return (
    <SectionShell id="agentgame" tone={tone} animate={animate} density={30}>
      <div className="premium-panel w-full p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="eyebrow">AgentGame</p>
            <h2 className="font-display text-3xl text-slate-900 sm:text-4xl">
              Analysez une entreprise et recevez un retour intelligent sur votre
              comprehension.
            </h2>
            <p className="text-base text-slate-600">
              AgentGame consiste a structurer votre analyse, confronter vos
              hypotheses et recevoir un debrief IA sur votre lecture des
              fondamentaux.
            </p>
            <Button
              asChild
              variant="outline"
              className="cta-soft shadow-none hover:shadow-none"
            >
              <Link href="/signup">Commencer une analyse</Link>
            </Button>
          </div>
          <div className="premium-panel-soft p-6 sm:p-8">
            <p className="eyebrow">Ce que vous recevez</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Un cadre d'analyse guide, centre sur les sources fiables.</li>
              <li>Une synthese de vos points forts et zones d'ombre.</li>
              <li>Un score de comprehension et des pistes d'approfondissement.</li>
              <li>Une methode reutilisable pour chaque entreprise etudiee.</li>
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

