"use client"

import { startTransition, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { RiArrowRightUpLine, RiMenuLine, RiUser3Line } from "@remixicon/react"

import { languages } from "@/components/i18n"
import { useI18n } from "@/components/i18n/LanguageProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PERMISSIONS } from "@/lib/auth/permissions"
import { requestSection } from "@/lib/section-navigation"
import { cn } from "@/lib/utils"

type NavigationItem =
  | {
      href: string
      label: string
      kind: "link"
    }
  | {
      label: string
      kind: "section"
      section: "quiz"
    }

type NavigationMode = "desktop" | "sheet"

function getNavigationButtonClasses(
  mode: NavigationMode,
  isActive: boolean
) {
  if (mode === "desktop") {
    return cn(
      "rounded-full px-3.5 text-[0.68rem] uppercase tracking-[0.22em] transition-colors",
      isActive
        ? "bg-primary/10 text-foreground shadow-sm"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    )
  }

  return cn(
    "h-11 justify-between rounded-2xl px-4",
    isActive
      ? "border-primary/30 bg-primary/10 text-foreground"
      : "border-border/60 bg-background/70 text-foreground"
  )
}

function buildRoleLabel(roles: string[]) {
  if (roles.length === 0) {
    return null
  }

  return roles.length === 1 ? roles[0] : `${roles[0]} +${roles.length - 1}`
}

function buildAccountLabel(
  session: ReturnType<typeof useSession>["data"],
  fallbackLabel: string
) {
  const name = session?.user.name?.trim()

  if (name) {
    return name
  }

  const email = session?.user.email?.trim()

  if (!email) {
    return fallbackLabel
  }

  return email.split("@")[0] || fallbackLabel
}

export default function Header() {
  const { language, setLanguage, copy } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const userPermissions = session?.user.permissions ?? []
  const userRoles = session?.user.roles ?? []
  const canAccessAdmin = userPermissions.includes(PERMISSIONS.ACCESS_ADMIN)
  const isAuthenticated = status === "authenticated"
  const roleLabel = buildRoleLabel(userRoles)
  const accountLabel = buildAccountLabel(session, copy.header.accountFallback)

  const navigationItems: NavigationItem[] = [
    { href: "/", label: copy.header.nav.home, kind: "link" },
    { href: "/momoia", label: copy.header.nav.momoia, kind: "link" },
    { href: "/agentgame", label: copy.header.nav.agentgame, kind: "link" },
    { label: copy.header.nav.miniQuiz, kind: "section", section: "quiz" },
    { href: "/about", label: copy.header.nav.about, kind: "link" },
    { href: "/contact", label: copy.header.nav.contact, kind: "link" },
  ]

  const handleLanguageChange = (nextLanguage: (typeof languages)[number]) => {
    if (nextLanguage === language) {
      return
    }

    setIsMenuOpen(false)

    startTransition(() => {
      setLanguage(nextLanguage)
      router.refresh()
    })
  }

  const handleSectionNavigation = (section: "quiz") => {
    setIsMenuOpen(false)

    if (pathname === "/") {
      requestSection(section)
      return
    }

    router.push(`/#${section}`)
  }

  const handleSignOut = () => {
    setIsMenuOpen(false)
    void signOut({ callbackUrl: "/login" })
  }

  const isNavigationItemActive = (item: NavigationItem) => {
    if (item.kind !== "link") {
      return false
    }

    if (item.href === "/") {
      return pathname === "/"
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  const renderNavigationItem = (
    item: NavigationItem,
    mode: NavigationMode
  ) => {
    const isActive = isNavigationItemActive(item)
    const className = getNavigationButtonClasses(mode, isActive)

    if (item.kind === "link") {
      if (mode === "sheet") {
        return (
          <SheetClose key={item.href} asChild>
            <Button asChild variant="outline" className={className}>
              <Link href={item.href}>
                {item.label}
                <RiArrowRightUpLine />
              </Link>
            </Button>
          </SheetClose>
        )
      }

      return (
        <Button key={item.href} asChild variant="ghost" className={className}>
          <Link href={item.href}>{item.label}</Link>
        </Button>
      )
    }

    if (mode === "sheet") {
      return (
        <SheetClose key={item.section} asChild>
          <Button
            type="button"
            variant="outline"
            className={className}
            onClick={() => handleSectionNavigation(item.section)}
          >
            {item.label}
            <RiArrowRightUpLine />
          </Button>
        </SheetClose>
      )
    }

    return (
      <Button
        key={item.section}
        type="button"
        variant="ghost"
        className={className}
        onClick={() => handleSectionNavigation(item.section)}
      >
        {item.label}
      </Button>
    )
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8 xl:px-10">
      <div className="app-panel mx-auto max-w-7xl rounded-[calc(var(--radius)+0.7rem)] px-3 py-3 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label={copy.header.logoAriaLabel}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-[0.7rem] font-semibold tracking-[0.28em] text-primary-foreground shadow-lg shadow-primary/20 sm:size-11">
              MA
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-[0.9rem] font-semibold tracking-[0.16em] text-foreground uppercase sm:text-[1rem]">
                Mainline Agent
              </p>
              <p className="hidden truncate text-xs text-muted-foreground md:block">
                Investor workspace
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 xl:hidden">
            <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-background/70 p-1 sm:flex">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={language === lang ? "secondary" : "ghost"}
                  size="xs"
                  className={cn(
                    "rounded-full px-2.5 text-[0.66rem] uppercase tracking-[0.2em]",
                    language === lang && "shadow-sm"
                  )}
                  onClick={() => handleLanguageChange(lang)}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>

            <Badge variant="outline" className="rounded-full px-2.5 sm:hidden">
              {language.toUpperCase()}
            </Badge>

            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full px-3 md:inline-flex"
              >
                <Link href="/dashboard">{copy.header.dashboard}</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full px-3 md:inline-flex"
              >
                <Link href="/login">{copy.header.login}</Link>
              </Button>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full px-3 sm:px-4">
                  <RiMenuLine />
                  <span className="sr-only">{copy.header.menu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                className="inset-y-2 right-2 h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[26rem] rounded-[1.75rem] border border-border/70 bg-popover/95"
                showCloseButton={true}
              >
                <SheetHeader className="border-b border-border/70 px-5 pb-5 pt-5">
                  <div className="space-y-3 pr-10">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <RiUser3Line className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <SheetTitle className="truncate">{accountLabel}</SheetTitle>
                        <SheetDescription className="truncate">
                          {roleLabel ?? copy.header.guestLabel}
                        </SheetDescription>
                      </div>
                    </div>
                  </div>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
                  <div className="space-y-3">
                    <p className="app-kicker">{copy.header.navigation}</p>
                    <div className="grid gap-2">
                      {navigationItems.map((item) =>
                        renderNavigationItem(item, "sheet")
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="app-kicker">{copy.header.language}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((lang) => (
                        <Button
                          key={lang}
                          type="button"
                          variant={language === lang ? "secondary" : "outline"}
                          className="rounded-2xl"
                          onClick={() => handleLanguageChange(lang)}
                        >
                          {lang.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="app-kicker">{copy.header.account}</p>
                    <div className="grid gap-2">
                      {isAuthenticated ? (
                        <>
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="outline"
                              className="h-11 justify-between rounded-2xl px-4"
                            >
                              <Link href="/dashboard">
                                {copy.header.dashboard}
                                <RiArrowRightUpLine />
                              </Link>
                            </Button>
                          </SheetClose>
                          {canAccessAdmin ? (
                            <SheetClose asChild>
                              <Button
                                asChild
                                variant="outline"
                                className="h-11 justify-between rounded-2xl px-4"
                              >
                                <Link href="/admin">
                                  {copy.header.admin}
                                  <RiArrowRightUpLine />
                                </Link>
                              </Button>
                            </SheetClose>
                          ) : null}
                          <Button
                            type="button"
                            className="h-11 rounded-2xl"
                            onClick={handleSignOut}
                          >
                            {copy.header.logout}
                          </Button>
                        </>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button
                              asChild
                              variant="outline"
                              className="h-11 justify-between rounded-2xl px-4"
                            >
                              <Link href="/login">
                                {copy.header.login}
                                <RiArrowRightUpLine />
                              </Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              asChild
                              className="h-11 justify-between rounded-2xl px-4"
                            >
                              <Link href="/login">
                                {copy.header.getStarted}
                                <RiArrowRightUpLine />
                              </Link>
                            </Button>
                          </SheetClose>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden items-center gap-3 xl:flex">
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/70 p-1">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={language === lang ? "secondary" : "ghost"}
                  size="xs"
                  className={cn(
                    "rounded-full px-2.5 text-[0.68rem] uppercase tracking-[0.22em]",
                    language === lang && "shadow-sm"
                  )}
                  onClick={() => handleLanguageChange(lang)}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex min-w-[13rem] items-center gap-3 rounded-[1.4rem] border border-border/70 bg-background/70 px-3 py-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <RiUser3Line className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {accountLabel}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {roleLabel ?? copy.header.guestLabel}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="rounded-full px-4">
                  <Link href="/dashboard">{copy.header.dashboard}</Link>
                </Button>
                {canAccessAdmin ? (
                  <Button asChild variant="outline" className="rounded-full px-4">
                    <Link href="/admin">{copy.header.admin}</Link>
                  </Button>
                ) : null}
                <Button
                  type="button"
                  className="rounded-full px-4"
                  onClick={handleSignOut}
                >
                  {copy.header.logout}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="rounded-full px-3">
                  <Link href="/login">{copy.header.login}</Link>
                </Button>
                <Button asChild className="rounded-full px-4">
                  <Link href="/login">
                    {copy.header.getStarted}
                    <RiArrowRightUpLine />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <nav className="hidden flex-wrap items-center gap-1 pt-3 xl:flex">
          {navigationItems.map((item) => renderNavigationItem(item, "desktop"))}
        </nav>
      </div>
    </header>
  )
}
