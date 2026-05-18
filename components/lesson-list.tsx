"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCodebase, getTopic } from "@/lib/data";
import type { Lesson, ViewMode } from "@/types";

type Props = {
  lessons: Lesson[];
  activeId?: string;
  viewMode: ViewMode;
  scopeSlug: string;
};

const SECTION_HEADING_CLASS =
  "px-2 mb-1.5 text-xs uppercase tracking-wider text-muted font-semibold";

const EMPTY_IMPLEMENTATION_COPY =
  "Field notes from real projects will appear here as you build.";

export function LessonList({ lessons, activeId, viewMode, scopeSlug }: Props) {
  const basePath =
    viewMode === "topic" ? `/topics/${scopeSlug}` : `/codebases/${scopeSlug}`;

  const chapters = React.useMemo(
    () =>
      lessons
        .filter((l) => l.type === "chapter")
        .slice()
        .sort(
          (a, b) =>
            (a.chapterNumber ?? Number.POSITIVE_INFINITY) -
            (b.chapterNumber ?? Number.POSITIVE_INFINITY),
        ),
    [lessons],
  );

  const implementations = React.useMemo(
    () =>
      lessons
        .filter((l) => l.type === "implementation")
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [lessons],
  );

  return (
    <aside className="w-60 shrink-0 py-6 pr-4 border-r border-rule">
      <section className="mb-6">
        <div className={SECTION_HEADING_CLASS}>Chapters</div>
        {chapters.length === 0 ? (
          <p className="px-2 text-sm text-muted">No chapters yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {chapters.map((l) => {
              const active = l.id === activeId;
              const sideBadge =
                viewMode === "topic"
                  ? getCodebase(l.codebaseSlug)
                  : getTopic(l.topicSlug);
              return (
                <li key={l.id}>
                  <Link
                    href={`${basePath}?lesson=${l.id}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-ink hover:bg-accent-soft/40",
                    )}
                  >
                    <span className="block leading-snug">
                      {typeof l.chapterNumber === "number" && (
                        <span className="text-muted mr-1">
                          Ch {l.chapterNumber}.
                        </span>
                      )}
                      {l.title}
                    </span>
                    {viewMode === "codebase" && sideBadge && (
                      <Badge variant="muted" className="mt-1 text-[10px]">
                        {sideBadge.name}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <div className={SECTION_HEADING_CLASS}>Implementation Learnings</div>
        {implementations.length === 0 ? (
          <p className="px-2 text-sm text-muted leading-snug">
            {EMPTY_IMPLEMENTATION_COPY}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {implementations.map((l) => {
              const active = l.id === activeId;
              const tag =
                viewMode === "topic"
                  ? getCodebase(l.codebaseSlug)
                  : getTopic(l.topicSlug);
              return (
                <li key={l.id}>
                  <Link
                    href={`${basePath}?lesson=${l.id}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block px-2 py-1.5 rounded-md text-sm transition-colors",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-ink hover:bg-accent-soft/40",
                    )}
                  >
                    <span className="block leading-snug">{l.title}</span>
                    {tag && (
                      <Badge variant="muted" className="mt-1 text-[10px]">
                        {tag.name}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </aside>
  );
}
