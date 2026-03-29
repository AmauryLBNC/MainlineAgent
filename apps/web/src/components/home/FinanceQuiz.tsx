"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionShell, type ThreadTone } from "./SectionShell";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  note: string;
};

export type FinanceQuizContent = {
  eyebrow: string;
  title: string;
  description: string;
  pausedStatus: string;
  runningStatus: string;
  correctLabel: string;
  reviewLabel: string;
  resultLabel: string;
  completedMessage: string;
  pendingMessage: string;
  longQuizCta: string;
  exitCta: string;
  questions: QuizQuestion[];
};

type FinanceQuizProps = {
  tone: ThreadTone;
  animate: boolean;
  rotationPaused: boolean;
  content: FinanceQuizContent;
  onInteract: () => void;
  onComplete: () => void;
  onExit: () => void;
};

export function FinanceQuiz({
  tone,
  animate,
  rotationPaused,
  content,
  onInteract,
  onComplete,
  onExit,
}: FinanceQuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    content.questions.map(() => null)
  );

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers((previousAnswers) => {
      const nextAnswers = [...previousAnswers];
      nextAnswers[questionIndex] = optionIndex;
      return nextAnswers;
    });
    onInteract();
  };

  const score = answers.reduce<number>((totalScore, answer, questionIndex) => {
    if (answer === content.questions[questionIndex]?.correct) {
      return totalScore + 1;
    }

    return totalScore;
  }, 0);

  const completed = answers.every((answer) => answer !== null);

  useEffect(() => {
    if (completed && rotationPaused) {
      onComplete();
    }
  }, [completed, onComplete, rotationPaused]);

  return (
    <SectionShell
      id="quiz"
      tone={tone}
      animate={animate}
      density={28}
      contentClassName="items-start"
    >
      <div
        className="premium-panel flex max-h-[calc(100dvh-9rem)] w-full flex-col overflow-hidden px-8 py-10 sm:px-12 sm:py-12"
        onPointerDown={onInteract}
        onFocusCapture={onInteract}
      >
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              {content.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {content.description}
            </p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            {rotationPaused ? content.pausedStatus : content.runningStatus}
          </div>
        </div>

        <div className="mt-8 flex min-h-0 flex-1 overflow-hidden">
          <div
            className="scrollbar-hidden -mr-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-4"
            data-quiz-scroll="true"
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="space-y-6">
              {content.questions.map((question, questionIndex) => {
                const selectedAnswer = answers[questionIndex];

                return (
                  <div key={question.prompt} className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {questionIndex + 1}. {question.prompt}
                    </p>
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isAnswered = selectedAnswer !== null;
                        const isCorrect = question.correct === optionIndex;
                        const showCorrect = isAnswered && isCorrect;
                        const showWrong = isAnswered && isSelected && !isCorrect;

                        return (
                          <button
                            key={option}
                            type="button"
                            className={cn(
                              "quiz-option",
                              isSelected && "is-selected",
                              showCorrect && "is-correct",
                              showWrong && "is-wrong"
                            )}
                            onClick={() => handleSelect(questionIndex, optionIndex)}
                            aria-pressed={isSelected}
                          >
                            <span>{option}</span>
                            {isAnswered ? (
                              <span className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                                {isCorrect
                                  ? content.correctLabel
                                  : isSelected
                                    ? content.reviewLabel
                                    : ""}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswer !== null ? (
                      <p className="text-xs text-slate-500">{question.note}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="soft-divider my-8" />

            <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  {content.resultLabel}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {score}/{content.questions.length}
                </p>
                <p className="text-sm text-slate-600">
                  {completed
                    ? content.completedMessage
                    : content.pendingMessage}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="cta-soft shadow-none hover:shadow-none"
                >
                  <Link href="/quiz/free">{content.longQuizCta}</Link>
                </Button>
                {rotationPaused ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="cta-soft shadow-none hover:shadow-none"
                    onClick={onExit}
                  >
                    {content.exitCta}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
