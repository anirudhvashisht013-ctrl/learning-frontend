export type Topic = {
  slug: string;
  name: string;
  description: string;
  order: number;
};

export type Codebase = {
  slug: string;
  name: string;
  description: string;
  color?: string;
};

export type LessonExample = {
  code: string;
  language: string;
  annotation?: string;
};

export type LessonAlternative = {
  approach: string;
  code?: string;
  whenToUse: string;
};

export type LessonUsage = {
  file: string;
  line?: number;
  commit?: string;
};

export type Lesson = {
  id: string;
  topicSlug: string;
  codebaseSlug: string;
  subtopic?: string;
  title: string;
  concept: string;
  example: LessonExample;
  alternatives: LessonAlternative[];
  critique: string;
  usedIn?: LessonUsage[];
  createdAt: string;
  tags: string[];
};

export type QuizType = "recall" | "application" | "critique";

export type Quiz = {
  id: string;
  lessonId: string;
  topicSlug: string;
  codebaseSlug: string;
  question: string;
  type: QuizType;
  answer: string;
  distractors?: string[];
};

export type ViewMode = "topic" | "codebase";
export type ContentMode = "notes" | "quiz";
