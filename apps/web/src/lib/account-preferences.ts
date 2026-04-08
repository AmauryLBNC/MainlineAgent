export const PROFILE_STORAGE_KEY = "mainagent-profile-v1"
export const SETTINGS_STORAGE_KEY = "mainagent-settings-v1"

export type ProfileDraft = {
  firstName: string
  lastName: string
  email: string
  countryCode: string
}

export type SettingsDraft = {
  marketAlerts: boolean
  weeklyDigest: boolean
  compactDashboard: boolean
  contextualTips: boolean
}

export function createDefaultProfileDraft(
  defaultEmail?: string | null
): ProfileDraft {
  return {
    firstName: "John",
    lastName: "Doe",
    email: defaultEmail?.trim() || "john.doe@example.com",
    countryCode: "FR",
  }
}

export const DEFAULT_SETTINGS_DRAFT: SettingsDraft = {
  marketAlerts: true,
  weeklyDigest: true,
  compactDashboard: false,
  contextualTips: false,
}
