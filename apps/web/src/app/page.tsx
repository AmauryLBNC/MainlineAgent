"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { AgentGame } from "@/components/home/AgentGame";
import { CompanyProfile } from "@/components/home/CompanyProfile";
import { FinanceQuiz } from "@/components/home/FinanceQuiz";
import { PromoMomo } from "@/components/home/PromoMomo";
import { HOME_THREAD_THEMES } from "@/components/home/SectionShell";
import { WarrenBuffett } from "@/components/home/WarrenBuffett";
import { SECTION_EVENT, type SectionId } from "@/lib/section-navigation";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, HashNavigation, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SECTION_IDS = [
  "momo",
  "buffett",
  "company",
  "quiz",
  "agentgame",
] as const satisfies readonly SectionId[];

export default function Home() {
  const { copy } = useI18n();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleSectionChange = (event: Event) => {
      const { detail } = event as CustomEvent<SectionId>;
      const targetIndex = SECTION_IDS.findIndex((sectionId) => sectionId === detail);

      if (targetIndex < 0) {
        return;
      }

      swiperRef.current?.slideTo(targetIndex);
    };

    window.addEventListener(SECTION_EVENT, handleSectionChange as EventListener);

    return () => {
      window.removeEventListener(
        SECTION_EVENT,
        handleSectionChange as EventListener
      );
    };
  }, []);

  const sections = [
    <PromoMomo
      key="momo"
      tone={HOME_THREAD_THEMES[0]}
      animate={activeIndex === 0}
      content={copy.home.promoMomo}
    />,
    <WarrenBuffett
      key="buffett"
      tone={HOME_THREAD_THEMES[1]}
      animate={activeIndex === 1}
      content={copy.home.buffett}
    />,
    <CompanyProfile
      key="company"
      tone={HOME_THREAD_THEMES[2]}
      animate={activeIndex === 2}
      content={copy.home.company}
    />,
    <FinanceQuiz
      key={`quiz-${copy.home.quiz.title}`}
      tone={HOME_THREAD_THEMES[3]}
      animate={activeIndex === 3}
      content={copy.home.quiz}
    />,
    <AgentGame
      key="agentgame"
      tone={HOME_THREAD_THEMES[4]}
      animate={activeIndex === 4}
      content={copy.home.agentgame}
    />,
  ];

  return (
    <main className="relative h-screen overflow-hidden text-foreground" id="top">
      <Swiper
        className="home-swiper"
        modules={[A11y, HashNavigation, Keyboard, Mousewheel, Pagination]}
        direction="vertical"
        slidesPerView={1}
        speed={900}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          releaseOnEdges: false,
          thresholdDelta: 40,
        }}
        hashNavigation={{
          watchState: true,
          replaceState: true,
        }}
        pagination={{
          clickable: true,
        }}
        onSwiper={(instance) => {
          swiperRef.current = instance;
          setActiveIndex(instance.activeIndex);
        }}
        onSlideChange={(instance) => {
          setActiveIndex(instance.activeIndex);
        }}
      >
        {sections.map((section, index) => (
          <SwiperSlide key={SECTION_IDS[index]} data-hash={SECTION_IDS[index]}>
            {section}
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
