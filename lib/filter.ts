import { lessons } from "@/lib/data";
import type { Lesson } from "@/types";

export function filterLessons(opts: { topicSlug?: string; codebaseSlug?: string }): Lesson[] {
  return lessons.filter((l) => {
    if (opts.topicSlug && l.topicSlug !== opts.topicSlug) return false;
    if (opts.codebaseSlug && l.codebaseSlug !== opts.codebaseSlug) return false;
    return true;
  });
}

export function groupBySubtopic(items: Lesson[]): Array<{ subtopic: string; lessons: Lesson[] }> {
  const map = new Map<string, Lesson[]>();
  for (const l of items) {
    const key = l.subtopic ?? "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return Array.from(map.entries()).map(([subtopic, lessons]) => ({ subtopic, lessons }));
}
