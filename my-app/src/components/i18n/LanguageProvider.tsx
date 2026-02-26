"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { copy, defaultLanguage, type Language } from "@/components/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: (typeof copy)[Language];
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "mainagent-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      return stored;
    }

    const browserLanguage = window.navigator.language.toLowerCase();
    return browserLanguage.startsWith("fr") ? "fr" : "en";
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      copy: copy[language],
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return context;
}
