"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FolderGit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { writeViewMode, readString, KEYS } from "@/lib/storage";
import { topics, codebases } from "@/lib/data";
import type { ViewMode } from "@/types";

type Props = {
  mode: ViewMode;
};

export function ViewModeToggle({ mode }: Props) {
  const router = useRouter();

  const switchTo = (next: ViewMode) => {
    if (next === mode) return;
    writeViewMode(next);
    if (next === "topic") {
      const last = readString(KEYS.lastTopic) ?? topics[0]?.slug;
      router.push(`/topics/${last}`);
    } else {
      const last = readString(KEYS.lastCodebase) ?? codebases[0]?.slug;
      router.push(`/codebases/${last}`);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Browse by"
      className="inline-flex items-center rounded-md border border-rule bg-paper p-0.5 text-sm"
    >
      <button
        role="tab"
        aria-selected={mode === "topic"}
        onClick={() => switchTo("topic")}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 h-7 rounded text-xs transition-colors",
          mode === "topic" ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
        )}
      >
        <BookOpen size={13} />
        Topic
      </button>
      <button
        role="tab"
        aria-selected={mode === "codebase"}
        onClick={() => switchTo("codebase")}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 h-7 rounded text-xs transition-colors",
          mode === "codebase" ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
        )}
      >
        <FolderGit2 size={13} />
        Codebase
      </button>
    </div>
  );
}
