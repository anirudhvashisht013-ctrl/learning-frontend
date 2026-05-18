import { lessons, quizzes } from "@/lib/data";
import type { Lesson, Quiz } from "@/types";

export type SearchResult = {
  lesson: Lesson;
  snippet: string;
  field: "title" | "concept" | "example" | "quiz";
  matchedQuiz?: Quiz;
};

const SNIPPET_RADIUS = 60;

function snippet(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text.slice(0, SNIPPET_RADIUS * 2);
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(text.length, idx + query.length + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return prefix + text.slice(start, end) + suffix;
}

export function searchAll(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: SearchResult[] = [];

  for (const lesson of lessons) {
    if (lesson.title.toLowerCase().includes(q)) {
      out.push({ lesson, snippet: lesson.title, field: "title" });
      continue;
    }
    if (lesson.concept.toLowerCase().includes(q)) {
      out.push({ lesson, snippet: snippet(lesson.concept, q), field: "concept" });
      continue;
    }
    if (lesson.example.code.toLowerCase().includes(q)) {
      out.push({ lesson, snippet: snippet(lesson.example.code, q), field: "example" });
    }
  }

  for (const quiz of quizzes) {
    if (quiz.question.toLowerCase().includes(q)) {
      const lesson = lessons.find((l) => l.id === quiz.lessonId);
      if (!lesson) continue;
      const already = out.find((r) => r.lesson.id === lesson.id && r.field === "quiz");
      if (already) continue;
      out.push({ lesson, snippet: snippet(quiz.question, q), field: "quiz", matchedQuiz: quiz });
    }
  }

  return out.slice(0, limit);
}

export function highlight(snippetText: string, query: string): Array<{ text: string; hit: boolean }> {
  const q = query.trim();
  if (!q) return [{ text: snippetText, hit: false }];
  const parts: Array<{ text: string; hit: boolean }> = [];
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const pieces = snippetText.split(re);
  for (const piece of pieces) {
    if (!piece) continue;
    parts.push({ text: piece, hit: piece.toLowerCase() === q.toLowerCase() });
  }
  return parts;
}
