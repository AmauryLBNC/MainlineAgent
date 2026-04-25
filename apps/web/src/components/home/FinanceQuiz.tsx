"use client"

import { useState } from "react"
import Link from "next/link"
import { RiArrowRightLine, RiRefreshLine } from "@remixicon/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  correctLabel: string
  reviewLabel: string
  resultLabel: string
  completedMessage: string
  pendingMessage: string
  continueCta: string
  validateCta: string
  nextQuestionCta: string
  finishCta: string
  retryCta: string
  finalScoreTitle: string
  questionLabel: string
  progressLabel: string
  questions: QuizQuestion[]
}

type FinanceQuizProps = {
  tone: ThreadTone
  animate: boolean
  content: FinanceQuizContent
}

function createInitialAnswers(questions: QuizQuestion[]) {
  return questions.map(() => null) as Array<number | null>
}

function createInitialRevealed(questions: QuizQuestion[]) {
  return questions.map(() => false)
}

export function FinanceQuiz({
  tone,
  animate,
  content,
}: FinanceQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    createInitialAnswers(content.questions)
  )
  const [revealedAnswers, setRevealedAnswers] = useState<boolean[]>(() =>
    createInitialRevealed(content.questions)
  )
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = content.questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestionIndex]
  const isCurrentAnswerRevealed = revealedAnswers[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === content.questions.length - 1

  const score = answers.reduce<number>((totalScore, answer, questionIndex) => {
    if (answer === content.questions[questionIndex]?.correct) {
      return totalScore + 1
    }

    return totalScore
  }, 0)

  function handleSelect(optionIndex: number) {
    if (isCurrentAnswerRevealed) {
      return
    }

    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers]
      nextAnswers[currentQuestionIndex] = optionIndex
      return nextAnswers
    })
  }

  function handleValidate() {
    if (selectedAnswer === null || isCurrentAnswerRevealed) {
      return
    }

    setRevealedAnswers((previousState) => {
      const nextState = [...previousState]
      nextState[currentQuestionIndex] = true
      return nextState
    })
  }

  function handleNext() {
    if (!isCurrentAnswerRevealed || isLastQuestion) {
      return
    }

    setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
  }

  function handleFinish() {
    if (!isCurrentAnswerRevealed || !isLastQuestion) {
      return
    }

    setIsFinished(true)
  }

  function handleRetry() {
    setCurrentQuestionIndex(0)
    setAnswers(createInitialAnswers(content.questions))
    setRevealedAnswers(createInitialRevealed(content.questions))
    setIsFinished(false)
  }

  return (
    <SectionShell
      id="quiz"
      tone={tone}
      animate={animate}
      density={24}
      contentClassName="items-center"
    >
      <Card className="app-panel w-full max-w-3xl rounded-[2rem] border-0 py-0">
        <CardHeader className="space-y-5 border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {content.eyebrow}
              </Badge>
              <CardTitle className="app-title text-2xl sm:text-3xl">
                {content.title}
              </CardTitle>
              <p className="app-copy max-w-xl text-sm leading-6 sm:text-base">
                {content.description}
              </p>
            </div>

            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {isFinished
                ? `${content.resultLabel} ${score}/${content.questions.length}`
                : `${content.questionLabel} ${currentQuestionIndex + 1}/${content.questions.length}`}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span>{content.progressLabel}</span>
              <span>
                {isFinished ? content.questions.length : currentQuestionIndex + 1}/
                {content.questions.length}
              </span>
            </div>
            <Progress
              value={
                isFinished
                  ? 100
                  : ((currentQuestionIndex + 1) / content.questions.length) * 100
              }
              className="h-2 rounded-full"
            />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
          {isFinished ? (
            <div className="space-y-4">
              <Card className="app-panel-soft rounded-[1.6rem] border-0 py-0">
                <CardContent className="space-y-3 px-5 py-5 sm:px-6">
                  <p className="app-kicker">{content.finalScoreTitle}</p>
                  <p className="app-title text-4xl text-foreground sm:text-5xl">
                    {score}/{content.questions.length}
                  </p>
                  <p className="app-copy text-sm leading-6">
                    {content.completedMessage}
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={handleRetry}
                >
                  {content.retryCta}
                  <RiRefreshLine />
                </Button>
                <Button asChild className="rounded-full px-5">
                  <Link href="/momoia">
                    {content.continueCta}
                    <RiArrowRightLine />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <Card className="app-panel-soft rounded-[1.6rem] border-0 py-0">
              <CardHeader className="space-y-3 px-5 pt-5 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="outline" className="rounded-full px-2.5">
                    {content.questionLabel} {currentQuestionIndex + 1}
                  </Badge>
                  {isCurrentAnswerRevealed ? (
                    <Badge
                      variant={
                        selectedAnswer === currentQuestion.correct
                          ? "secondary"
                          : "destructive"
                      }
                      className="rounded-full px-2.5"
                    >
                      {selectedAnswer === currentQuestion.correct
                        ? content.correctLabel
                        : content.reviewLabel}
                    </Badge>
                  ) : null}
                </div>
                <CardTitle className="text-base leading-7 text-foreground sm:text-lg">
                  {currentQuestion.prompt}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 px-5 pb-5 sm:px-6">
                <div className="grid gap-2">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === optionIndex
                    const isCorrect = currentQuestion.correct === optionIndex
                    const state = isCurrentAnswerRevealed
                      ? isCorrect
                        ? "correct"
                        : isSelected
                          ? "wrong"
                          : "idle"
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
                        onClick={() => handleSelect(optionIndex)}
                        aria-pressed={isSelected}
                        disabled={isCurrentAnswerRevealed}
                      >
                        <span className="flex-1">{option}</span>
                        {isCurrentAnswerRevealed ? (
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

                <p className="text-sm text-muted-foreground">
                  {isCurrentAnswerRevealed
                    ? currentQuestion.note
                    : content.pendingMessage}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    className="rounded-full px-5"
                    disabled={selectedAnswer === null || isCurrentAnswerRevealed}
                    onClick={handleValidate}
                  >
                    {content.validateCta}
                  </Button>

                  {isCurrentAnswerRevealed ? (
                    isLastQuestion ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full px-5"
                        onClick={handleFinish}
                      >
                        {content.finishCta}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full px-5"
                        onClick={handleNext}
                      >
                        {content.nextQuestionCta}
                      </Button>
                    )
                  ) : null}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </SectionShell>
  )
}
