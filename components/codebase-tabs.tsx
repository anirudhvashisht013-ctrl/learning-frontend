"use client";

import * as React from "react";
import Link from "next/link";
import { codebases, countLessonsByCodebase } from "@/lib/data";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  activeSlug?: string;
};

export function CodebaseTabs({ activeSlug }: Props) {
  return (
    <nav
      aria-label="Codebases"
      className="h-12 border-b border-rule bg-paper sticky top-14 z-20"
    >
      <div className="mx-auto max-w-[1200px] h-full px-6 flex items-center gap-1 overflow-x-auto">
        {codebases.map((c) => {
          const active = c.slug === activeSlug;
          const count = countLessonsByCodebase(c.slug);
          return (
            <Tooltip key={c.slug} label={`${count} ${count === 1 ? "lesson" : "lessons"}`}>
              <Link
                href={`/codebases/${c.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center h-12 px-3 text-sm font-medium whitespace-nowrap",
                  "text-muted hover:text-ink transition-colors",
                  active && "text-accent",
                )}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                  style={{ backgroundColor: c.color ?? "currentColor" }}
                  aria-hidden
                />
                {c.name}
                {active && (
                  <span aria-hidden className="absolute left-3 right-3 bottom-0 h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
