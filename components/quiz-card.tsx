"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCodebase, getLesson, getTopic } from "@/lib/data";
import type { Quiz } from "@/types";

type Props = {
  quiz: Quiz;
  showLessonLink?: boolean;
  onAnswered?: (correct: boolean) => void;
  className?: string;
};

export function QuizCard({ quiz, showLessonLink = true, onAnswered, className }: Props) {
  const [revealed, setRevealed] = React.useState(false);
  const [marked, setMarked] = React.useState<null | boolean>(null);

  React.useEffect(() => {
    setRevealed(false);
    setMarked(null);
  }, [quiz.id]);

  const lesson = getLesson(quiz.lessonId);
  const topic = getTopic(quiz.topicSlug);
  const codebase = getCodebase(quiz.codebaseSlug);

  const mark = (correct: boolean) => {
    setMarked(correct);
    onAnswered?.(correct);
  };

  return (
    <article className={cn("rounded-lg border border-rule bg-paper p-6", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="muted" className="capitalize">{quiz.type}</Badge>
        {topic && <Badge variant="muted">{topic.name}</Badge>}
        {codebase && <Badge variant="muted">{codebase.name}</Badge>}
      </div>

      <h3 className="font-sans text-lg font-semibold text-ink leading-snug">
        {quiz.question}
      </h3>

      <div className="mt-5">
        {!revealed ? (
          <Button onClick={() => setRevealed(true)} variant="subtle" size="sm">
            <Eye size={14} /> Reveal answer
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="rounded-md border border-rule bg-accent-soft/40 p-3 font-serif text-[15px] leading-relaxed text-ink">
              {quiz.answer}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => mark(true)} variant={marked === true ? "default" : "outline"} size="sm">
                Got it
              </Button>
              <Button onClick={() => mark(false)} variant={marked === false ? "default" : "outline"} size="sm">
                Need to review
              </Button>
              <Button onClick={() => setRevealed(false)} variant="ghost" size="sm">
                <EyeOff size={14} /> Hide
              </Button>
            </div>
          </div>
        )}
      </div>

      {showLessonLink && lesson && (
        <p className="mt-4 pt-3 border-t border-rule text-xs text-muted">
          From{" "}
          <Link href={`/topics/${lesson.topicSlug}?lesson=${lesson.id}`} className="text-accent hover:underline">
            {lesson.title}
          </Link>
        </p>
      )}
    </article>
  );
}
