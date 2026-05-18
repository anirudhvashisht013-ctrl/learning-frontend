"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizCard } from "@/components/quiz-card";
import { quizzes as allQuizzes, getTopic, getCodebase } from "@/lib/data";
import { readQuizProgress, writeQuizProgress } from "@/lib/storage";
import type { Quiz } from "@/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weakestKey(answers: Array<{ q: Quiz; correct: boolean }>, by: "topicSlug" | "codebaseSlug") {
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

export function QuizRunner() {
  const [deck, setDeck] = React.useState<Quiz[]>(() => shuffle(allQuizzes));
  const [index, setIndex] = React.useState(0);
  const [history, setHistory] = React.useState<Array<{ q: Quiz; correct: boolean }>>([]);

  const current = deck[index];
  const done = index >= deck.length;

  const onAnswered = (correct: boolean) => {
    if (!current) return;
    setHistory((h) => [...h, { q: current, correct }]);
    const progress = readQuizProgress();
    progress.answered[current.id] = { correct, revealedAt: new Date().toISOString() };
    writeQuizProgress(progress);
    window.setTimeout(() => setIndex((i) => i + 1), 250);
  };

  const restart = () => {
    setDeck(shuffle(allQuizzes));
    setIndex(0);
    setHistory([]);
  };

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
          {weakTopic && <p>Weakest topic: <span className="text-accent">{getTopic(weakTopic)?.name}</span></p>}
          {weakCodebase && <p>Weakest codebase: <span className="text-accent">{getCodebase(weakCodebase)?.name}</span></p>}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={restart}>
            <RotateCcw size={14} /> New session
          </Button>
          <Link href="/topics/tailwind">
            <Button variant="ghost" size="md">Back to notes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-xs text-muted">
        <span>Question {index + 1} of {deck.length}</span>
        <button type="button" onClick={restart} className="hover:text-ink transition-colors inline-flex items-center gap-1">
          <RotateCcw size={12} /> Reshuffle
        </button>
      </div>
      {current && <QuizCard quiz={current} onAnswered={onAnswered} />}
    </div>
  );
}
