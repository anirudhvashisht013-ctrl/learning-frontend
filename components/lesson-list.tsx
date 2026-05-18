"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCodebase, getTopic } from "@/lib/data";
import { groupBySubtopic } from "@/lib/filter";
import type { Lesson, ViewMode } from "@/types";

type Props = {
  lessons: Lesson[];
  activeId?: string;
  viewMode: ViewMode;
  scopeSlug: string;
};

export function LessonList({ lessons, activeId, viewMode, scopeSlug }: Props) {
  const groups = groupBySubtopic(lessons);
  const basePath = viewMode === "topic" ? `/topics/${scopeSlug}` : `/codebases/${scopeSlug}`;

  if (!lessons.length) {
    return (
      <aside className="w-60 shrink-0 py-6 pr-4 border-r border-rule">
        <p className="text-sm text-muted px-2">No lessons here yet.</p>
      </aside>
    );
  }

  return (
    <aside className="w-60 shrink-0 py-6 pr-4 border-r border-rule">
      {groups.map((group) => (
        <div key={group.subtopic} className="mb-5">
          <div className="px-2 mb-1.5 text-[10px] uppercase tracking-[0.12em] text-muted font-semibold">
            {group.subtopic}
          </div>
          <ul className="space-y-0.5">
            {group.lessons.map((l) => {
              const active = l.id === activeId;
              const sideBadge = viewMode === "topic"
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
                    {sideBadge && (
                      <Badge variant="muted" className="mt-1 text-[10px]">
                        {sideBadge.name}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
