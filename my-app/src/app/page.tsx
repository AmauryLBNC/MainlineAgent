"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { AgentGame } from "@/components/home/AgentGame";
import { CompanyProfile } from "@/components/home/CompanyProfile";
import { FinanceQuiz } from "@/components/home/FinanceQuiz";
import { PromoMomo } from "@/components/home/PromoMomo";
import { HOME_THREAD_THEMES } from "@/components/home/SectionShell";
import { WarrenBuffett } from "@/components/home/WarrenBuffett";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import type { SectionId } from "@/lib/section-navigation";

const SECTION_IDS = [
  "momo",
  "buffett",
  "company",
  "quiz",
  "agentgame",
] as const satisfies readonly SectionId[];

export default function Home() {
  const { copy } = useI18n();
  const {
    active,
    incoming,
    rotationPaused,
    transition,
    getTransform,
    handleQuizInteract,
    handleQuizExit,
    handleQuizComplete,
  } = useSectionScroll({
    sectionIds: SECTION_IDS,
    quizIndex: SECTION_IDS.indexOf("quiz"),
  });

  const sections = [
    <PromoMomo
      key="momo"
      tone={HOME_THREAD_THEMES[0]}
      animate={active === 0 || incoming === 0}
      content={copy.home.promoMomo}
    />,
    <WarrenBuffett
      key="buffett"
      tone={HOME_THREAD_THEMES[1]}
      animate={active === 1 || incoming === 1}
      content={copy.home.buffett}
    />,
    <CompanyProfile
      key="company"
      tone={HOME_THREAD_THEMES[2]}
      animate={active === 2 || incoming === 2}
      content={copy.home.company}
    />,
    <FinanceQuiz
      key={`quiz-${copy.home.quiz.title}`}
      tone={HOME_THREAD_THEMES[3]}
      animate={active === 3 || incoming === 3}
      rotationPaused={rotationPaused}
      content={copy.home.quiz}
      onInteract={handleQuizInteract}
      onComplete={handleQuizComplete}
      onExit={handleQuizExit}
    />,
    <AgentGame
      key="agentgame"
      tone={HOME_THREAD_THEMES[4]}
      animate={active === 4 || incoming === 4}
      content={copy.home.agentgame}
    />,
  ];

  return (
    <main className="relative h-screen overflow-hidden text-foreground" id="top">
      {sections.map((section, index) => (
        <div
          key={index}
          className="absolute inset-0 will-change-transform"
          style={{
            transform: getTransform(index),
            transition,
          }}
        >
          {section}
        </div>
      ))}
    </main>
  );
}
