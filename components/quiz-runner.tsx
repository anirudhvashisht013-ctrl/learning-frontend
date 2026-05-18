"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz-card";
import {
  quizzes as allQuizzes,
  topics,
  getTopic,
  getCodebase,
} from "@/lib/data";
import {
  KEYS,
  readQuizProgress,
  readString,
  writeQuizProgress,
} from "@/lib/storage";
import type { Quiz } from "@/types";

type Props = {
  quizzes?: Quiz[];
  shuffleQuizzes?: boolean;
  showLessonLink?: boolean;
  emptyMessage?: string;
  onBackToNotes?: () => void;
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weakestKey(
  answers: Array<{ q: Quiz; correct: boolean }>,
  by: "topicSlug" | "codebaseSlug",
) {
  const stats = new Map<string, { wrong: number; total: number }>();
  for (const { q, correct } of answers) {
    const k = q[by];
    const s = stats.get(k) ?? { wrong: 0, total: 0 };
    s.total += 1;
    if (!correct) s.wrong += 1;
    stats.set(k, s);
  }
  let worst: string | null = null;
  let worstRatio = -1;
  for (const [k, s] of stats) {
    const r = s.wrong / s.total;
    if (r > worstRatio) {
      worstRatio = r;
      worst = k;
    }
  }
  return worst;
}

export function QuizRunner({
  quizzes,
  shuffleQuizzes = true,
  showLessonLink = true,
  emptyMessage = "No quizzes here yet.",
  onBackToNotes,
}: Props) {
  const router = useRouter();
  const source = quizzes ?? allQuizzes;
  const buildDeck = React.useCallback(
    () => (shuffleQuizzes ? shuffle(source) : source.slice()),
    [source, shuffleQuizzes],
  );

  const handleBackToNotes = () => {
    if (onBackToNotes) {
      onBackToNotes();
      return;
    }
    const slug = readString(KEYS.lastTopic) ?? topics[0]?.slug ?? "tailwind";
    router.push(`/topics/${slug}`);
  };

  const [deck, setDeck] = React.useState<Quiz[]>(() => buildDeck());
  const [index, setIndex] = React.useState(0);
  const [history, setHistory] = React.useState<
    Array<{ q: Quiz; correct: boolean }>
  >([]);

  React.useEffect(() => {
    setDeck(buildDeck());
    setIndex(0);
    setHistory([]);
  }, [buildDeck]);

  const current = deck[index];
  const done = deck.length > 0 && index >= deck.length;

  const onAnswered = (correct: boolean) => {
    if (!current) return;
    setHistory((h) => [...h, { q: current, correct }]);
    const progress = readQuizProgress();
    progress.answered[current.id] = {
      correct,
      revealedAt: new Date().toISOString(),
    };
    writeQuizProgress(progress);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setDeck(buildDeck());
    setIndex(0);
    setHistory([]);
  };

  if (deck.length === 0) {
    return (
      <div className="rounded-lg border border-rule bg-paper p-6 text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  if (done) {
    const correctCount = history.filter((h) => h.correct).length;
    const weakTopic = weakestKey(history, "topicSlug");
    const weakCodebase = weakestKey(history, "codebaseSlug");
    return (
      <div className="rounded-lg border border-rule bg-paper p-8 text-center">
        <p className="text-sm text-muted">Session complete</p>
        <p className="font-serif text-4xl text-ink mt-2 mb-6">
          {correctCount} <span className="text-muted">/</span> {history.length}
        </p>
        <div className="text-sm text-ink space-y-1">
          {weakTopic && (
            <p>
              Weakest topic:{" "}
              <span className="text-accent">{getTopic(weakTopic)?.name}</span>
            </p>
          )}
          {weakCodebase && (
            <p>
              Weakest codebase:{" "}
              <span className="text-accent">
                {getCodebase(weakCodebase)?.name}
              </span>
            </p>
          )}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={restart}>
            <RotateCcw size={14} /> New session
          </Button>
          <Button onClick={handleBackToNotes} variant="ghost" size="md">
            Back to notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs text-muted">
        <span>
          Question {index + 1} of {deck.length}
        </span>
        <button
          type="button"
          onClick={restart}
          className="hover:text-ink transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw size={12} />{" "}
          {shuffleQuizzes ? "Reshuffle" : "Restart"}
        </button>
      </div>
      {current && (
        <QuizCard
          quiz={current}
          showLessonLink={showLessonLink}
          onAnswered={onAnswered}
        />
      )}
    </div>
  );
}
