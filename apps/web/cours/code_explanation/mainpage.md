"use client";
permet d executer le code cote client

import { useI18n } from "@/components/i18n/LanguageProvider";
permet de recuperer la traduction des textes

import { useSectionScroll } from "@/hooks/useSectionScroll";
permet la logique de navigation scroll animation

import des composants
import { AgentGame } from "@/components/home/AgentGame";
import { CompanyProfile } from "@/components/home/CompanyProfile";
import { FinanceQuiz } from "@/components/home/FinanceQuiz";
import { PromoMomo } from "@/components/home/PromoMomo";
import { HOME_THREAD_THEMES } from "@/components/home/SectionShell";
import { WarrenBuffett } from "@/components/home/WarrenBuffett";

import type { SectionId } from "@/lib/section-navigation";


listes des identifiants des sections dans leurs ordres d affichage
const SECTION_IDS = [
  "momo",
  "buffett",
  "company",
  "quiz",
  "agentgame",
] as const satisfies readonly SectionId[];



la fonction principale
export default function Home() {
  recupere copy depuis le provider de langue
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
  active savoir quelle page est active
  incoming  savoir quelle page est a venir si une transitionest en cours
  rotation paused dit si la rotation automatique est en pause
  transition chaine css a appliquer pour une transition
  getTransform(index) donne la position virtuelle css d une section selon son index
  handle quiz interact() :  met en pause l auto rotationquand user interagit avec le quiz
  handle quiz exit : enleve la pause et fair avancer apres la section quiz
  handle quiz complete enleve la fin du quizz


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
  on retourne un element 
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
