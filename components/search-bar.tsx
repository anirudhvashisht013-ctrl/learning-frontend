"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchAll, highlight, type SearchResult } from "@/lib/search";
import { getTopic, getCodebase } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 10);
    else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const results: SearchResult[] = React.useMemo(() => searchAll(query), [query]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  const goTo = (r: SearchResult) => {
    setOpen(false);
    router.push(`/topics/${r.lesson.topicSlug}?lesson=${r.lesson.id}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const r = results[active];
      if (r) goTo(r);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 w-full max-w-sm h-8 px-3 rounded-md",
          "border border-rule bg-paper text-muted text-sm hover:text-ink hover:border-accent/40 transition-colors",
        )}
        aria-label="Open search"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search lessons, code, quizzes…</span>
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-rule text-muted">⌘K</kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen} labelledBy="search-label">
        <div className="p-3 border-b border-rule">
          <label id="search-label" className="sr-only">Search</label>
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search lessons, code, quizzes…"
            className="h-10 border-none text-base focus-visible:ring-0"
          />
        </div>
        <ul className="max-h-[60vh] overflow-auto py-1">
          {query && results.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted text-center">No matches.</li>
          )}
          {results.map((r, i) => {
            const topic = getTopic(r.lesson.topicSlug);
            const codebase = getCodebase(r.lesson.codebaseSlug);
            return (
              <li key={`${r.lesson.id}-${r.field}-${i}`}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => goTo(r)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 flex flex-col gap-1 transition-colors",
                    i === active ? "bg-accent-soft" : "hover:bg-accent-soft/50",
                  )}
                >
                  <span className="text-sm font-medium text-ink">{r.lesson.title}</span>
                  <span className="text-xs text-muted line-clamp-1">
                    {highlight(r.snippet, query).map((p, j) =>
                      p.hit ? (
                        <mark key={j} className="bg-accent/20 text-accent rounded px-0.5">{p.text}</mark>
                      ) : (
                        <span key={j}>{p.text}</span>
                      ),
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 mt-0.5">
                    {topic && <Badge variant="muted">{topic.name}</Badge>}
                    {codebase && <Badge variant="muted">{codebase.name}</Badge>}
                    <span className="text-[10px] text-muted uppercase tracking-wide">{r.field}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Dialog>
    </>
  );
}
