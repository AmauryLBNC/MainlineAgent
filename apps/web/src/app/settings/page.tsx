import PageShell from "@/components/Base/PageShell"
import { SettingsPreferencesPanel } from "@/components/settings/SettingsPreferencesPanel"
import { PERMISSIONS } from "@/lib/auth/permissions"
import { requireAppAuth } from "@/lib/auth/session"

export default async function SettingsPage() {
  await requireAppAuth(PERMISSIONS.MANAGE_SETTINGS)

  return (
    <PageShell align="start" density={18}>
      <div className="w-full py-20">
        <div className="mx-auto max-w-5xl">
          <SettingsPreferencesPanel />
        </div>
      </div>
    </PageShell>
  )
}
