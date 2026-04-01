import fr from "./fr";
import en from "./en";

export const languages = ["fr", "en"] as const;
export const LANGUAGE_STORAGE_KEY = "mainagent-language";

export type Language = (typeof languages)[number];

export const copy = {
  fr,
  en,
};

export const defaultLanguage: Language = "fr";
