import Link from "next/link"

import PageShell from "@/components/Base/PageShell"
import { getServerCopy } from "@/components/i18n/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMISSIONS } from "@/lib/auth/permissions"
import { requireAppAuth } from "@/lib/auth/session"

export default async function DashboardPage() {
  const copy = await getServerCopy()
  const session = await requireAppAuth(PERMISSIONS.VIEW_DASHBOARD)
  const canAccessAdmin = session.user.permissions.includes(
    PERMISSIONS.ACCESS_ADMIN
  )

  const actions = [
    {
      href: "/profile",
      title: copy.authPages.dashboard.profile,
      description: copy.authPages.dashboard.profileDescription,
      variant: "default" as const,
    },
    {
      href: "/settings",
      title: copy.authPages.dashboard.settings,
      description: copy.authPages.dashboard.settingsDescription,
      variant: "outline" as const,
    },
    ...(canAccessAdmin
      ? [
          {
            href: "/admin",
            title: copy.authPages.dashboard.admin,
            description: copy.authPages.dashboard.adminDescription,
            variant: "outline" as const,
          },
        ]
      : []),
  ]

  return (
    <PageShell align="start" density={22}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.authPages.dashboard.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.authPages.dashboard.welcomeBack}
                {session.user.name ? `, ${session.user.name}` : ""}
              </CardTitle>
              <p className="app-copy max-w-2xl text-sm leading-7 sm:text-base">
                {copy.authPages.dashboard.description}
              </p>
            </CardHeader>
          </Card>

          <div
            className={`grid gap-4 ${
              canAccessAdmin ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {actions.map((action) => (
              <Card
                key={action.href}
                className="app-panel-soft rounded-[1.75rem] border-0 py-0"
              >
                <CardHeader className="space-y-3 px-6 pt-6">
                  <CardTitle className="app-title text-2xl sm:text-3xl">
                    {action.title}
                  </CardTitle>
                  <p className="app-copy text-sm leading-7">
                    {action.description}
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Button asChild variant={action.variant} className="rounded-full px-5">
                    <Link href={action.href}>{action.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
