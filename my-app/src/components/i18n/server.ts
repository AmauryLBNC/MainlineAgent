import { cookies } from "next/headers";
import {
  copy,
  defaultLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "@/components/i18n";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const language = cookieStore.get(LANGUAGE_STORAGE_KEY)?.value;

  if (language === "fr" || language === "en") {
    return language;
  }

  return defaultLanguage;
}

export async function getServerCopy() {
  const language = await getServerLanguage();
  return copy[language];
}
