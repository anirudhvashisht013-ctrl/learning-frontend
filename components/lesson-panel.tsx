"use client";

import { useEffect } from "react";
import { useLessonPanel } from "@/lib/lesson-panel-context";
import { lessons } from "@/lib/data";
import Markdown from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";

export function LessonPanel() {
  const { state, closeLesson, goBack } = useLessonPanel();

  // Close on Escape
  useEffect(() => {
    if (!state.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLesson();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.isOpen, closeLesson]);

  if (!state.isOpen || !state.currentLessonId) return null;

  const lesson = lessons.find((l) => l.id === state.currentLessonId);

  if (!lesson) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="flex-1 bg-black/20 backdrop-blur-sm"
          onClick={closeLesson}
          aria-hidden
        />
        <aside className="w-full md:w-[480px] lg:w-[560px] bg-paper border-l border-rule shadow-2xl flex flex-col">
          <div className="p-6 border-b border-rule flex items-center justify-between">
            <h2 className="text-base font-medium">Lesson not found</h2>
            <Button variant="ghost" size="sm" onClick={closeLesson}>
              Close
            </Button>
          </div>
          <div className="p-6 text-muted">
            No lesson with id <code>{state.currentLessonId}</code> exists.
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/20 backdrop-blur-sm transition-opacity duration-200"
        onClick={closeLesson}
        aria-hidden
      />
      {/* Panel */}
      <aside
        className="w-full md:w-[480px] lg:w-[560px] bg-paper border-l border-rule shadow-2xl flex flex-col animate-panel-in"
        role="dialog"
        aria-modal="true"
        aria-label={lesson.title}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-rule flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {state.history.length > 0 && (
              <Button variant="ghost" size="sm" onClick={goBack} aria-label="Back">
                ← Back
              </Button>
            )}
            <Badge variant="outline">Preview</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={closeLesson} aria-label="Close panel">
            Close ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <Badge variant="muted">{lesson.topicSlug}</Badge>
            <Badge variant="muted">{lesson.codebaseSlug}</Badge>
            {lesson.tags?.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink mb-4">
            {lesson.title}
          </h1>

          <div className="prose-notebook font-serif">
            <Markdown>{lesson.concept}</Markdown>

            {lesson.example?.code && (
              <div className="mt-6">
                <CodeBlock
                  code={lesson.example.code}
                  language={lesson.example.language || "text"}
                  annotation={lesson.example.annotation}
                />
              </div>
            )}

            {lesson.alternatives && lesson.alternatives.length > 0 && (
              <div className="mt-6">
                <h2 className="font-sans text-sm uppercase tracking-[0.12em] text-muted mb-3">
                  Alternatives
                </h2>
                <ul className="space-y-3 list-none p-0">
                  {lesson.alternatives.map((alt, i) => (
                    <li key={i} className="border-l-2 border-accent/30 pl-4">
                      <p className="font-sans font-medium text-ink">{alt.approach}</p>
                      <p className="font-serif text-[15px] text-muted">{alt.whenToUse}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.critique && (
              <div className="mt-6">
                <h2 className="font-sans text-sm uppercase tracking-[0.12em] text-muted mb-3">
                  Critique
                </h2>
                <Markdown>{lesson.critique}</Markdown>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
