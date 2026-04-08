import PageShell from "@/components/Base/PageShell"
import { ProfileDetailsForm } from "@/components/profile/ProfileDetailsForm"
import { PERMISSIONS } from "@/lib/auth/permissions"
import { requireAppAuth } from "@/lib/auth/session"
import { getUserSnapshot } from "@/lib/data/users"

export default async function ProfilePage() {
  const session = await requireAppAuth(PERMISSIONS.VIEW_PROFILE)
  const profile = await getUserSnapshot(session.user.id)

  const providers = Array.from(
    new Set(profile?.accounts.map((account) => account.provider) ?? [])
  )

  return (
    <PageShell align="start" density={20}>
      <div className="w-full py-20">
        <div className="mx-auto max-w-6xl">
          <ProfileDetailsForm
            defaultEmail={profile?.email ?? session.user.email ?? null}
            providers={providers}
          />
        </div>
      </div>
    </PageShell>
  )
}
