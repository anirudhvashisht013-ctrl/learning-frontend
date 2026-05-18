import type { ContentMode, ViewMode } from "@/types";

const isBrowser = () => typeof window !== "undefined";

export const KEYS = {
  viewMode: "ll:view-mode",
  contentMode: "ll:content-mode",
  lastTopic: "ll:last-topic",
  lastCodebase: "ll:last-codebase",
  lastLesson: "ll:last-lesson",
  quizProgress: "ll:quiz-progress",
} as const;

export function readString(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* quota exceeded — silently drop */
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  writeString(key, JSON.stringify(value));
}

export function readViewMode(): ViewMode {
  const v = readString(KEYS.viewMode);
  return v === "codebase" ? "codebase" : "topic";
}

export function writeViewMode(v: ViewMode) {
  writeString(KEYS.viewMode, v);
}

export function readContentMode(): ContentMode {
  const v = readString(KEYS.contentMode);
  return v === "quiz" ? "quiz" : "notes";
}

export function writeContentMode(v: ContentMode) {
  writeString(KEYS.contentMode, v);
}

export type QuizProgress = {
  answered: Record<string, { correct: boolean; revealedAt: string }>;
};

export function readQuizProgress(): QuizProgress {
  return readJSON<QuizProgress>(KEYS.quizProgress, { answered: {} });
}

export function writeQuizProgress(p: QuizProgress) {
  writeJSON(KEYS.quizProgress, p);
}
