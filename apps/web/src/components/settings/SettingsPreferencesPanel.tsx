"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/components/i18n/LanguageProvider"
import {
  DEFAULT_SETTINGS_DRAFT,
  SETTINGS_STORAGE_KEY,
  type SettingsDraft,
} from "@/lib/account-preferences"

function isSettingsDraft(value: unknown): value is SettingsDraft {
  if (!value || typeof value !== "object") {
    return false
  }

  const draft = value as Record<string, unknown>

  return (
    typeof draft.marketAlerts === "boolean" &&
    typeof draft.weeklyDigest === "boolean" &&
    typeof draft.compactDashboard === "boolean" &&
    typeof draft.contextualTips === "boolean"
  )
}

export function SettingsPreferencesPanel() {
  const { copy } = useI18n()
  const [draft, setDraft] = useState<SettingsDraft>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS_DRAFT
    }

    try {
      const storedValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

      if (!storedValue) {
        return DEFAULT_SETTINGS_DRAFT
      }

      const parsedValue = JSON.parse(storedValue) as unknown
      return isSettingsDraft(parsedValue) ? parsedValue : DEFAULT_SETTINGS_DRAFT
    } catch {
      return DEFAULT_SETTINGS_DRAFT
    }
  })

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  const items = useMemo(
    () => [
      {
        key: "marketAlerts" as const,
        title: copy.authPages.settings.marketAlertsTitle,
        description: copy.authPages.settings.marketAlertsDescription,
      },
      {
        key: "weeklyDigest" as const,
        title: copy.authPages.settings.weeklyDigestTitle,
        description: copy.authPages.settings.weeklyDigestDescription,
      },
      {
        key: "compactDashboard" as const,
        title: copy.authPages.settings.compactDashboardTitle,
        description: copy.authPages.settings.compactDashboardDescription,
      },
      {
        key: "contextualTips" as const,
        title: copy.authPages.settings.contextualTipsTitle,
        description: copy.authPages.settings.contextualTipsDescription,
      },
    ],
    [copy]
  )

  return (
    <Card className="app-panel rounded-[2rem] border-0 py-0">
      <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
            {copy.authPages.settings.eyebrow}
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {copy.authPages.settings.localSaveBadge}
          </Badge>
        </div>
        <CardTitle className="app-title text-4xl sm:text-5xl">
          {copy.authPages.settings.title}
        </CardTitle>
        <p className="app-copy max-w-2xl text-sm leading-7 sm:text-base">
          {copy.authPages.settings.description}
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
        {items.map((item) => (
          <div
            key={item.key}
            className="app-choice flex items-center justify-between gap-4 rounded-[1.6rem] px-4 py-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Switch
              checked={draft[item.key]}
              onCheckedChange={(checked) =>
                setDraft((currentDraft) => ({
                  ...currentDraft,
                  [item.key]: checked,
                }))
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
