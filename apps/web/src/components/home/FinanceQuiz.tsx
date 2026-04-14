"use client"

import { useState } from "react"
import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionShell, type ThreadTone } from "./SectionShell"

export type QuizQuestion = {
  prompt: string
  options: string[]
  correct: number
  note: string
}

export type FinanceQuizContent = {
  eyebrow: string
  title: string
  description: string
  pausedStatus: string
  runningStatus: string
  correctLabel: string
  reviewLabel: string
  resultLabel: string
  completedMessage: string
  pendingMessage: string
  longQuizCta: string
  exitCta: string
  questions: QuizQuestion[]
}

type FinanceQuizProps = {
  tone: ThreadTone
  animate: boolean
  content: FinanceQuizContent
}

export function FinanceQuiz({
  tone,
  animate,
  content,
}: FinanceQuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    content.questions.map(() => null)
  )

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers]
      nextAnswers[questionIndex] = optionIndex
      return nextAnswers
    })
  }

  const score = answers.reduce<number>((totalScore, answer, questionIndex) => {
    if (answer === content.questions[questionIndex]?.correct) {
      return totalScore + 1
    }

    return totalScore
  }, 0)

  const answeredCount = answers.filter((answer) => answer !== null).length
  const completed = answers.every((answer) => answer !== null)

  return (
    <SectionShell
      id="quiz"
      tone={tone}
      animate={animate}
      density={28}
      contentClassName="items-start"
    >
      <Card className="app-panel flex max-h-[calc(100dvh-9.5rem)] w-full rounded-[2rem] border-0 py-0">
        <CardHeader className="space-y-5 border-b border-border/70 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {content.eyebrow}
              </Badge>
              <CardTitle className="app-title text-3xl sm:text-4xl">
                {content.title}
              </CardTitle>
              <p className="app-copy max-w-3xl text-sm leading-7 sm:text-base">
                {content.description}
              </p>
            </div>

            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {content.runningStatus}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>{content.resultLabel}</span>
              <span>
                {answeredCount}/{content.questions.length}
              </span>
            </div>
            <Progress
              value={(answeredCount / content.questions.length) * 100}
              className="h-2 rounded-full"
            />
          </div>
        </CardHeader>

        <CardContent className="min-h-0 flex-1 px-6 pb-6 sm:px-8">
          <div className="h-full rounded-[1.5rem] border border-border/60 bg-background/55 p-1">
            <ScrollArea className="swiper-no-mousewheel swiper-no-swiping h-[calc(100dvh-25.5rem)] rounded-[1.25rem] px-5 sm:px-6">
              <div className="space-y-5 py-6 pr-2">
                {content.questions.map((question, questionIndex) => {
                  const selectedAnswer = answers[questionIndex]

                  return (
                    <Card
                      key={question.prompt}
                      size="sm"
                      className="app-panel-soft rounded-[1.6rem] border-0 py-0"
                    >
                      <CardHeader className="space-y-3 px-5 pt-5">
                        <div className="flex items-center justify-between gap-4">
                          <Badge variant="outline" className="rounded-full px-2.5">
                            {questionIndex + 1}
                          </Badge>
                          {selectedAnswer !== null ? (
                            <Badge
                              variant={
                                selectedAnswer === question.correct
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="rounded-full px-2.5"
                            >
                              {selectedAnswer === question.correct
                                ? content.correctLabel
                                : content.reviewLabel}
                            </Badge>
                          ) : null}
                        </div>
                        <CardTitle className="text-base leading-7 text-foreground">
                          {question.prompt}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 px-5 pb-5">
                        <div className="grid gap-2">
                          {question.options.map((option, optionIndex) => {
                            const isSelected = selectedAnswer === optionIndex
                            const isAnswered = selectedAnswer !== null
                            const isCorrect = question.correct === optionIndex
                            const state =
                              isAnswered && isCorrect
                                ? "correct"
                                : isAnswered && isSelected
                                  ? "wrong"
                                  : isSelected
                                    ? "active"
                                    : "idle"

                            return (
                              <Button
                                key={option}
                                type="button"
                                variant="outline"
                                className={cn(
                                  "h-auto justify-between rounded-2xl px-4 py-3 text-left whitespace-normal",
                                  state === "active" &&
                                    "border-primary/35 bg-accent text-foreground",
                                  state === "correct" &&
                                    "border-emerald-500/35 bg-emerald-50 text-emerald-950",
                                  state === "wrong" &&
                                    "border-destructive/35 bg-destructive/10 text-destructive"
                                )}
                                onClick={() =>
                                  handleSelect(questionIndex, optionIndex)
                                }
                                aria-pressed={isSelected}
                              >
                                <span className="flex-1">{option}</span>
                                {isAnswered ? (
                                  <span className="font-mono text-[0.64rem] uppercase tracking-[0.24em]">
                                    {isCorrect
                                      ? content.correctLabel
                                      : isSelected
                                        ? content.reviewLabel
                                        : ""}
                                  </span>
                                ) : null}
                              </Button>
                            )
                          })}
                        </div>

                        {selectedAnswer !== null ? (
                          <p className="app-copy text-sm leading-7">
                            {question.note}
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  )
                })}

                <Separator />

                <div className="grid gap-5 pb-4 lg:grid-cols-[0.75fr_1fr]">
                  <Card className="app-panel-soft rounded-[1.6rem] border-0 py-0">
                    <CardContent className="space-y-3 px-5 py-5">
                      <p className="app-kicker">{content.resultLabel}</p>
                      <p className="app-title text-4xl">
                        {score}/{content.questions.length}
                      </p>
                      <p className="app-copy text-sm leading-7">
                        {completed
                          ? content.completedMessage
                          : content.pendingMessage}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button asChild variant="outline" className="rounded-full px-5">
                      <Link href="/momoia">
                        {content.longQuizCta}
                        <RiArrowRightLine />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  )
}
