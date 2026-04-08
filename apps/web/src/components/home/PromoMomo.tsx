import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SectionShell, type ThreadTone } from "./SectionShell"

export type PromoMomoContent = {
  eyebrow: string
  title: string
  description: string
  cta: string
}

type PromoMomoProps = {
  tone: ThreadTone
  animate: boolean
  content: PromoMomoContent
}

export function PromoMomo({ tone, animate, content }: PromoMomoProps) {
  return (
    <SectionShell id="momo" tone={tone} animate={animate} density={30}>
      <Card className="app-panel w-full rounded-[2rem] border-0 py-0">
        <CardHeader className="gap-5 px-6 pt-6 sm:px-8 sm:pt-8">
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
            {content.eyebrow}
          </Badge>
          <div className="space-y-4">
            <CardTitle className="app-title max-w-4xl text-4xl leading-none sm:text-5xl lg:text-6xl">
              {content.title}
            </CardTitle>
            <CardDescription className="app-copy max-w-2xl text-base leading-7 sm:text-lg">
              {content.description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
          <p className="app-kicker">{content.description}</p>
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/momoia">
              {content.cta}
              <RiArrowRightLine />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </SectionShell>
  )
}
