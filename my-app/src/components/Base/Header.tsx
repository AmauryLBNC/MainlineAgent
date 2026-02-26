"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { languages } from "@/components/i18n";
import { cn } from "@/lib/utils";

export default function Header() {
  const { language, setLanguage, copy } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 header-bar">
      <div className="header-inner">
        <div className="header-layout">
          <Link href="/" className="header-logo" aria-label={copy.header.logoAriaLabel}>
            <span className="header-logo-mark">MA</span>
          </Link>

          <nav className="header-nav hidden lg:flex">
            <Link className="nav-link" href="/">
              {copy.header.nav.home}
            </Link>
            <Link className="nav-link" href="/momoia">
              {copy.header.nav.momoia}
            </Link>
            <Link className="nav-link" href="/agentgame">
              {copy.header.nav.agentgame}
            </Link>
            <Link className="nav-link" href="/#quiz">
              {copy.header.nav.miniQuiz}
            </Link>
            <Link className="nav-link" href="/about">
              {copy.header.nav.about}
            </Link>
            <Link className="nav-link" href="/contact">
              {copy.header.nav.contact}
            </Link>
          </nav>

          <div className="header-actions hidden lg:flex">
            <div className="header-lang">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "header-lang-button",
                    language === lang && "is-active"
                  )}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <Link className="header-action" href="/login">
              {copy.header.login}
            </Link>
            <Link className="header-cta" href="/signup">
              {copy.header.getStarted}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
