"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { languages } from "@/components/i18n";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils";

export default function Header() {
  const { language, setLanguage, copy } = useI18n();
  const { data: session, status } = useSession();
  const canAccessAdmin =
    session?.user.permissions.includes(PERMISSIONS.ACCESS_ADMIN) ?? false;
  const isAuthenticated = status === "authenticated";

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
              {isAuthenticated ? (
                <>
                  <Link className="header-action" href="/dashboard">
                    {copy.header.dashboard}
                  </Link>
                  {canAccessAdmin ? (
                    <Link className="header-action" href="/admin">
                      {copy.header.admin}
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="header-cta"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    {copy.header.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link className="header-action" href="/login">
                    {copy.header.login}
                  </Link>
                  <Link className="header-cta" href="/login">
                    {copy.header.getStarted}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
