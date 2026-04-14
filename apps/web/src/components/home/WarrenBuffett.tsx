import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SectionShell, type ThreadTone } from "./SectionShell"

export type WarrenBuffettContent = {
  eyebrow: string
  quote: string
  quoteBy: string
  paragraphs: string[]
  essentialsEyebrow: string
  essentialsTitle: string
  essentials: string[]
  footer: string
}

type WarrenBuffettProps = {
  tone: ThreadTone
  animate: boolean
  content: WarrenBuffettContent
}

export function WarrenBuffett({
  tone,
  animate,
  content,
}: WarrenBuffettProps) {
  return (
    <SectionShell id="buffett" tone={tone} animate={animate} density={24}>
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="app-panel rounded-[2rem] border-0 py-0">
          <CardHeader className="space-y-5 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {content.eyebrow}
            </Badge>
            <blockquote className="app-title text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {content.quote}
            </blockquote>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {content.quoteBy}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 sm:px-8 sm:pb-8">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph} className="app-copy text-sm leading-7 sm:text-base">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
          <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              {content.essentialsEyebrow}
            </Badge>
            <CardTitle className="app-title text-2xl sm:text-3xl">
              {content.essentialsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="space-y-4">
              {content.essentials.map((item, index) => (
                <div key={item} className="grid grid-cols-[auto_1fr] gap-3">
                  <Badge
                    variant="outline"
                    className="mt-0.5 rounded-full px-2.5 py-1"
                  >
                    {index + 1}
                  </Badge>
                  <div className="border-l border-border/80 pl-4">
                    <p className="text-sm leading-7 text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <p className="app-copy text-sm leading-7">{content.footer}</p>
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  )
}
