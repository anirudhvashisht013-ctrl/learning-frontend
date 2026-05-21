"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import Markdown from "@/components/markdown";
import { QuizRunner } from "@/components/quiz-runner";
import { cn } from "@/lib/utils";
import { getCodebase, getQuizzesByLesson, getTopic } from "@/lib/data";
import type { Lesson } from "@/types";

type Props = { lesson: Lesson };

type Tab = "notes" | "quiz";

export function LessonView({ lesson }: Props) {
  const [tab, setTab] = React.useState<Tab>("notes");
  const topic = getTopic(lesson.topicSlug);
  const codebase = getCodebase(lesson.codebaseSlug);
  const quizzes = React.useMemo(
    () => getQuizzesByLesson(lesson.id),
    [lesson.id],
  );

  React.useEffect(() => setTab("notes"), [lesson.id]);

  return (
    <article className="flex-1 min-w-0 py-6 pl-6 pr-2">
      <header className="mb-6">
        <h1 className="font-sans text-[26px] font-semibold tracking-tight text-ink leading-tight">
          {lesson.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {codebase && (
            <Link href={`/codebases/${codebase.slug}`}>
              <Badge variant="outline" className="hover:bg-accent-soft cursor-pointer">
                From {codebase.name}
              </Badge>
            </Link>
          )}
          {topic && (
            <Link href={`/topics/${topic.slug}`}>
              <Badge variant="outline" className="hover:bg-accent-soft cursor-pointer">
                Topic: {topic.name}
              </Badge>
            </Link>
          )}
        </div>
      </header>

      <div role="tablist" aria-label="Lesson sections" className="flex items-center gap-4 mb-6 border-b border-rule">
        {(["notes", "quiz"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "relative py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "text-accent" : "text-muted hover:text-ink",
            )}
          >
            {t === "quiz" ? `Quiz (${quizzes.length})` : "Notes"}
            {tab === t && <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] bg-accent rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "notes" ? (
        <div className="prose-notebook font-serif max-w-prose">
          <Markdown>{lesson.concept}</Markdown>
          {lesson.example.code && <CodeBlock {...lesson.example} />}
          {lesson.alternatives.length > 0 && (
            <section className="mt-6">
              <h2 className="font-sans text-sm uppercase tracking-[0.12em] text-muted mb-2">Alternatives</h2>
              <ul className="space-y-4 list-none p-0">
                {lesson.alternatives.map((a, i) => (
                  <li key={i} className="border-l-2 border-accent/30 pl-4">
                    <p className="font-sans font-medium text-ink">{a.approach}</p>
                    {a.code && <CodeBlock code={a.code} language={lesson.example.language} />}
                    <p className="font-serif text-[15px] text-muted">{a.whenToUse}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {lesson.critique && (
            <section className="mt-6">
              <h2 className="font-sans text-sm uppercase tracking-[0.12em] text-muted mb-2">Critique</h2>
              <Markdown>{lesson.critique}</Markdown>
            </section>
          )}
        </div>
      ) : (
        <div className="max-w-prose">
          <QuizRunner
            quizzes={quizzes}
            shuffleQuizzes={false}
            showLessonLink={false}
            emptyMessage="No quizzes yet for this lesson."
            onBackToNotes={() => setTab("notes")}
          />
        </div>
      )}
    </article>
  );
}
