"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";

type AppProvidersProps = {
  children: React.ReactNode;
  session?: Session | null;
};

export function AppProviders({ children, session }: AppProvidersProps) {
  return (
    <SessionProvider session={session}>
      <LanguageProvider>{children}</LanguageProvider>
    </SessionProvider>
  );
}
