"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  createDefaultProfileDraft,
  PROFILE_STORAGE_KEY,
  type ProfileDraft,
} from "@/lib/account-preferences"
import { getCountryOptions } from "@/lib/countries"

type ProfileDetailsFormProps = {
  defaultEmail?: string | null
  providers: string[]
}

function isProfileDraft(value: unknown): value is ProfileDraft {
  if (!value || typeof value !== "object") {
    return false
  }

  const draft = value as Record<string, unknown>

  return (
    typeof draft.firstName === "string" &&
    typeof draft.lastName === "string" &&
    typeof draft.email === "string" &&
    typeof draft.countryCode === "string"
  )
}

function toProviderLabel(provider: string) {
  return provider.slice(0, 1).toUpperCase() + provider.slice(1)
}

export function ProfileDetailsForm({
  defaultEmail,
  providers,
}: ProfileDetailsFormProps) {
  const { copy, language } = useI18n()
  const [draft, setDraft] = useState<ProfileDraft>(() => {
    const fallbackDraft = createDefaultProfileDraft(defaultEmail)

    if (typeof window === "undefined") {
      return fallbackDraft
    }

    try {
      const storedValue = window.localStorage.getItem(PROFILE_STORAGE_KEY)

      if (!storedValue) {
        return fallbackDraft
      }

      const parsedValue = JSON.parse(storedValue) as unknown
      return isProfileDraft(parsedValue) ? parsedValue : fallbackDraft
    } catch {
      return fallbackDraft
    }
  })
  const [isSaved, setIsSaved] = useState(false)

  const countryOptions = useMemo(() => getCountryOptions(language), [language])
  const selectedCountry =
    countryOptions.find((country) => country.code === draft.countryCode) ?? null

  useEffect(() => {
    if (!isSaved) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsSaved(false)
    }, 1800)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isSaved])

  function updateDraft<Key extends keyof ProfileDraft>(
    key: Key,
    value: ProfileDraft[Key]
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }))
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft))
    setIsSaved(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="app-panel rounded-[2rem] border-0 py-0">
        <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {copy.authPages.profile.identity}
            </Badge>
            {isSaved ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {copy.authPages.profile.saved}
              </Badge>
            ) : null}
          </div>
          <CardTitle className="app-title text-4xl sm:text-5xl">
            {copy.authPages.profile.title}
          </CardTitle>
          <p className="app-copy max-w-2xl text-sm leading-7 sm:text-base">
            {copy.authPages.profile.description}
          </p>
        </CardHeader>
        <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">
                  {copy.authPages.profile.firstName}
                </Label>
                <Input
                  id="first-name"
                  value={draft.firstName}
                  className="h-11 rounded-2xl px-4 text-sm"
                  onChange={(event) =>
                    updateDraft("firstName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">
                  {copy.authPages.profile.lastName}
                </Label>
                <Input
                  id="last-name"
                  value={draft.lastName}
                  className="h-11 rounded-2xl px-4 text-sm"
                  onChange={(event) =>
                    updateDraft("lastName", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">
                  {copy.authPages.profile.email}
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={draft.email}
                  className="h-11 rounded-2xl px-4 text-sm"
                  onChange={(event) => updateDraft("email", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country-code">
                  {copy.authPages.profile.residenceCountry}
                </Label>
                <Select
                  value={draft.countryCode}
                  onValueChange={(value) => updateDraft("countryCode", value)}
                >
                  <SelectTrigger id="country-code">
                    <SelectValue
                      placeholder={copy.authPages.profile.countryPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="rounded-full px-5">
              {copy.authPages.profile.saveProfile}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
        <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            {copy.authPages.profile.accountSummary}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="app-choice rounded-2xl px-4 py-4">
            <p className="app-kicker">{copy.authPages.profile.name}</p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {[draft.firstName, draft.lastName].filter(Boolean).join(" ")}
            </p>
          </div>
          <div className="app-choice rounded-2xl px-4 py-4">
            <p className="app-kicker">{copy.authPages.profile.email}</p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {draft.email}
            </p>
          </div>
          <div className="app-choice rounded-2xl px-4 py-4">
            <p className="app-kicker">
              {copy.authPages.profile.residenceCountry}
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {selectedCountry
                ? `${selectedCountry.flag} ${selectedCountry.label}`
                : copy.authPages.profile.countryPlaceholder}
            </p>
          </div>
          <div className="app-choice rounded-2xl px-4 py-4">
            <p className="app-kicker">
              {copy.authPages.profile.connectedProviders}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {providers.length > 0 ? (
                providers.map((provider) => (
                  <Badge
                    key={provider}
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {toProviderLabel(provider)}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {copy.authPages.profile.noProviderMetadata}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
