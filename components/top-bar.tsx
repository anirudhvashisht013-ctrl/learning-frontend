"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NotebookPen, ListChecks } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { ViewModeToggle } from "@/components/view-mode-toggle";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

type Props = {
  viewMode: ViewMode;
};

export function TopBar({ viewMode }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const inQuiz = pathname?.startsWith("/quiz") ?? false;

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-rule bg-paper/85 backdrop-blur">
      <div className="mx-auto max-w-[1200px] h-full px-6 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-accent text-white font-serif italic text-lg leading-none">L</span>
          <span className="font-sans font-semibold tracking-tight text-ink">Learning Lab</span>
        </Link>

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div role="group" aria-label="Mode" className="inline-flex rounded-md border border-rule bg-paper p-0.5">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={!inQuiz}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 h-7 rounded text-xs transition-colors",
                !inQuiz ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
              )}
              aria-pressed={!inQuiz}
            >
              <NotebookPen size={13} />
              Notes
            </button>
            <Link
              href="/quiz"
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 h-7 rounded text-xs transition-colors",
                inQuiz ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
              )}
              aria-pressed={inQuiz}
            >
              <ListChecks size={13} />
              Quiz
            </Link>
          </div>
          <ViewModeToggle mode={viewMode} />
        </div>
      </div>
    </header>
  );
}
