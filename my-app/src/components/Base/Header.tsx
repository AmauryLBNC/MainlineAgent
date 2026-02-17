"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { languages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function Header() {
  const { language, setLanguage } = useI18n();

  return (
    <header className="fixed inset-x-0 top-0 z-50 header-bar">
      <div className="header-inner">
        <div className="header-layout">
          <Link href="/" className="header-logo" aria-label="Accueil">
            <span className="header-logo-mark">MA</span>
          </Link>

          <nav className="header-nav hidden lg:flex">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/momoia">
              MomoIA
            </Link>
            <Link className="nav-link" href="/agentgame">
              AgentGame
            </Link>
            <Link className="nav-link" href="/#quiz">
              MiniQuiz
            </Link>
            <Link className="nav-link" href="/about">
              About
            </Link>
            <Link className="nav-link" href="/contact">
              Contact Us
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
              Login
            </Link>
            <Link className="header-cta" href="/signup">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
