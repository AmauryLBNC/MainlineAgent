"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { languages } from "@/components/i18n";
import { cn } from "@/lib/utils";

export default function Header() {
  const { language, setLanguage, copy } = useI18n();
  const router = useRouter();
  const { data: session, status } = useSession();


  return (
    <header className="fixed inset-x-0 top-0 z-50 header-bar">
      <div className="header-inner">
        <div className="header-layout">
          <div className="header-layout-start">
            <Link href="/" className="header-logo" aria-label={copy.header.logoAriaLabel}>
              <span className="header-logo-mark">MA</span>
            </Link>
          </div>

          <div className="header-layout-center">
            <nav className="header-nav hidden lg:flex">
              <Link className="nav-link" href="/posts/new">
                Post
              </Link>
              <Link className="nav-link" href="/page_test">
                Test Page
              </Link>
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
          </div>

          <div className="header-layout-end">
            <div className="header-actions hidden lg:flex">
              <div className="header-lang">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      if (lang === language) {
                        return;
                      }

                      setLanguage(lang);
                      router.refresh();
                    }}
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
              
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
