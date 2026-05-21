"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Markdown from "@/components/markdown";
import { cn } from "@/lib/utils";
import { getCodebase, getLesson, getTopic } from "@/lib/data";
import type { Quiz, QuizOption } from "@/types";

type Props = {
  quiz: Quiz;
  showLessonLink?: boolean;
  onAnswered?: (correct: boolean) => void;
  className?: string;
};

const WRONG_COLOR = "#B74A4A";

type OptionState = "idle" | "correct" | "incorrect-pick" | "correct-reveal";

function optionState(
  option: QuizOption,
  selectedId: string | null,
): OptionState {
  if (selectedId === null) return "idle";
  if (option.id === selectedId) {
    return option.isCorrect ? "correct" : "incorrect-pick";
  }
  if (option.isCorrect) return "correct-reveal";
  return "idle";
}

export function QuizCard({
  quiz,
  showLessonLink = true,
  onAnswered,
  className,
}: Props) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSelectedId(null);
  }, [quiz.id]);

  const lesson = getLesson(quiz.lessonId);
  const topic = getTopic(quiz.topicSlug);
  const codebase = getCodebase(quiz.codebaseSlug);

  const answered = selectedId !== null;
  const selectedOption = quiz.options.find((o) => o.id === selectedId);
  const wasCorrect = selectedOption?.isCorrect ?? false;

  const onSelect = (id: string) => {
    if (selectedId !== null) return;
    setSelectedId(id);
  };

  const onNext = () => {
    onAnswered?.(wasCorrect);
  };

  return (
    <article
      className={cn("rounded-lg border border-rule bg-paper p-6", className)}
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="muted" className="capitalize">
          {quiz.type}
        </Badge>
        {topic && <Badge variant="muted">{topic.name}</Badge>}
        {codebase && <Badge variant="muted">{codebase.name}</Badge>}
      </div>

      <div className="font-sans text-lg font-semibold text-ink leading-snug">
        <Markdown>{quiz.question}</Markdown>
      </div>

      <ul role="radiogroup" className="mt-5 flex flex-col gap-2">
        {quiz.options.map((option) => {
          const state = optionState(option, selectedId);
          return (
            <li key={option.id}>
              <OptionRow
                option={option}
                state={state}
                disabled={answered}
                onSelect={() => onSelect(option.id)}
              />
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-5 flex items-center justify-end">
          <Button onClick={onNext} size="sm">
            Next <ArrowRight size={14} />
          </Button>
        </div>
      )}

      {showLessonLink && lesson && (
        <p className="mt-4 pt-3 border-t border-rule text-xs text-muted">
          From{" "}
          <Link
            href={`/topics/${lesson.topicSlug}?lesson=${lesson.id}`}
            className="text-accent hover:underline"
          >
            {lesson.title}
          </Link>
        </p>
      )}
    </article>
  );
}

type OptionRowProps = {
  option: QuizOption;
  state: OptionState;
  disabled: boolean;
  onSelect: () => void;
};

function OptionRow({ option, state, disabled, onSelect }: OptionRowProps) {
  const showExplanation = state !== "idle";

  const buttonBase =
    "w-full text-left rounded-md border px-3 py-2.5 text-[15px] leading-snug transition-colors";
  const buttonByState: Record<OptionState, string> = {
    idle:
      "border-rule bg-paper text-ink hover:border-accent/30 hover:bg-accent-soft/30",
    correct:
      "border-accent bg-[color:var(--accent)]/10 text-ink",
    "correct-reveal":
      "border-accent bg-[color:var(--accent)]/10 text-ink",
    "incorrect-pick": "",
  };

  const buttonInlineStyle =
    state === "incorrect-pick"
      ? {
          borderColor: WRONG_COLOR,
          backgroundColor: "rgba(183, 74, 74, 0.08)",
          color: "var(--text-primary)",
        }
      : undefined;

  const iconForState: Record<OptionState, React.ReactNode> = {
    idle: null,
    correct: <Check size={14} className="text-accent" />,
    "correct-reveal": <Check size={14} className="text-accent" />,
    "incorrect-pick": <X size={14} style={{ color: WRONG_COLOR }} />,
  };

  const explanationBorderColor =
    state === "incorrect-pick" ? WRONG_COLOR : "var(--accent)";

  return (
    <div>
      <button
        type="button"
        role="radio"
        aria-checked={state === "correct" || state === "incorrect-pick"}
        disabled={disabled && state === "idle"}
        onClick={onSelect}
        className={cn(buttonBase, buttonByState[state])}
        style={buttonInlineStyle}
      >
        <span className="flex items-start gap-2">
          <span className="font-mono text-xs uppercase text-muted mt-0.5">
            {option.id}.
          </span>
          <span className="flex-1 font-serif">{option.text}</span>
          {iconForState[state] && (
            <span className="mt-0.5 shrink-0">{iconForState[state]}</span>
          )}
        </span>
      </button>
      {showExplanation && (
        <div
          className="mt-1.5 ml-3 pl-3 border-l-2 text-xs text-muted leading-relaxed font-serif"
          style={{ borderColor: explanationBorderColor }}
        >
          <Markdown>{option.explanation}</Markdown>
        </div>
      )}
    </div>
  );
}
