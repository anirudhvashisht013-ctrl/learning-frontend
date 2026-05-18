import topicsJson from "@/data/topics.json";
import codebasesJson from "@/data/codebases.json";
import lessonsJson from "@/data/lessons.json";
import quizzesJson from "@/data/quizzes.json";
import type { Codebase, Lesson, Quiz, Topic } from "@/types";

export const topics: Topic[] = (topicsJson as Topic[])
  .slice()
  .sort((a, b) => a.order - b.order);

export const codebases: Codebase[] = codebasesJson as Codebase[];
export const lessons: Lesson[] = lessonsJson as Lesson[];
export const quizzes: Quiz[] = quizzesJson as Quiz[];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getCodebase(slug: string): Codebase | undefined {
  return codebases.find((c) => c.slug === slug);
}

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function getLessonsByTopic(slug: string): Lesson[] {
  return lessons.filter((l) => l.topicSlug === slug);
}

export function getLessonsByCodebase(slug: string): Lesson[] {
  return lessons.filter((l) => l.codebaseSlug === slug);
}

export function getQuizzesByLesson(lessonId: string): Quiz[] {
  return quizzes.filter((q) => q.lessonId === lessonId);
}

export function countLessonsByTopic(slug: string): number {
  return getLessonsByTopic(slug).length;
}

export function countLessonsByCodebase(slug: string): number {
  return getLessonsByCodebase(slug).length;
}
