"use client";

import { TopBar } from "@/components/top-bar";
import { QuizRunner } from "@/components/quiz-runner";
import { readViewMode } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { ViewMode } from "@/types";

export default function QuizPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("topic");

  useEffect(() => {
    setViewMode(readViewMode());
  }, []);

  return (
    <>
      <TopBar viewMode={viewMode} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <header className="mb-6">
            <h1 className="font-sans text-2xl font-semibold text-ink">Mixed quiz</h1>
            <p className="text-sm text-muted mt-1">
              Questions interleaved across every topic and codebase you&apos;ve added.
            </p>
          </header>
          <QuizRunner />
        </div>
      </main>
    </>
  );
}
