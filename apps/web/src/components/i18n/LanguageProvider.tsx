"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  copy,
  defaultLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "@/components/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: (typeof copy)[Language];
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readLanguageCookie() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LANGUAGE_STORAGE_KEY}=`))
    ?.split("=")[1];

  return cookieValue === "fr" || cookieValue === "en" ? cookieValue : null;
}

function persistLanguage(language: Language) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
  document.documentElement.lang = language;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const cookieLanguage = readLanguageCookie();
    if (cookieLanguage) {
      setLanguageState(cookieLanguage);
      return;
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "fr" || stored === "en") {
      setLanguageState(stored);
      return;
    }

    const browserLanguage = window.navigator.language.toLowerCase();
    setLanguageState(browserLanguage.startsWith("fr") ? "fr" : "en");
  }, []);

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

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