import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionShell, type ThreadTone } from "./SectionShell"

export type CompanyProfileContent = {
  profileEyebrow: string
  name: string
  demoDataLabel: string
  profileLines: string[]
  ceoEyebrow: string
  ceoName: string
  ceoDescription: string
  ceoBullets: string[]
  toolsEyebrow: string
  metrics: Array<{ label: string; value: string }>
  perEyebrow: string
  perDescription: string
  perBullets: string[]
}

type CompanyProfileProps = {
  tone: ThreadTone
  animate: boolean
  content: CompanyProfileContent
}

export function CompanyProfile({
  tone,
  animate,
  content,
}: CompanyProfileProps) {
  return (
    <SectionShell id="company" tone={tone} animate={animate} density={26}>
      <div className="grid w-full gap-4 lg:grid-cols-2">
        <Card className="app-panel rounded-[1.75rem] border-0 py-0">
          <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {content.profileEyebrow}
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {content.demoDataLabel}
              </Badge>
            </div>
            <CardTitle className="app-title text-3xl sm:text-4xl">
              {content.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6 sm:px-8 sm:pb-8">
            {content.profileLines.map((line) => (
              <p key={line} className="app-copy text-sm leading-7">
                {line}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="app-panel-soft rounded-[1.75rem] border-0 py-0">
          <CardHeader className="space-y-3 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              {content.ceoEyebrow}
            </Badge>
            <CardTitle className="app-title text-2xl sm:text-3xl">
              {content.ceoName}
            </CardTitle>
            <p className="app-copy text-sm leading-7">{content.ceoDescription}</p>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
            {content.ceoBullets.map((bullet) => (
              <div key={bullet} className="app-choice rounded-2xl px-4 py-3">
                <p className="app-copy text-sm leading-7">{bullet}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="app-panel-soft rounded-[1.75rem] border-0 py-0">
          <CardHeader className="space-y-3 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {content.toolsEyebrow}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-2 sm:px-8 sm:pb-8">
            {content.metrics.map((metric) => (
              <div key={metric.label} className="app-metric rounded-2xl px-4 py-4">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-3 text-lg font-semibold text-foreground sm:text-xl">
                  {metric.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="app-panel rounded-[1.75rem] border-0 py-0">
          <CardHeader className="space-y-3 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              {content.perEyebrow}
            </Badge>
            <p className="app-copy text-sm leading-7">{content.perDescription}</p>
          </CardHeader>
          <CardContent className="grid gap-3 px-6 pb-6 sm:px-8 sm:pb-8">
            {content.perBullets.map((bullet) => (
              <div key={bullet} className="app-choice rounded-2xl px-4 py-3">
                <p className="app-copy text-sm leading-7">{bullet}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}
