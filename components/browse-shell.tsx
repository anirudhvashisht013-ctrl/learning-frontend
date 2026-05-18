"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { TopicTabs } from "@/components/topic-tabs";
import { CodebaseTabs } from "@/components/codebase-tabs";
import { LessonList } from "@/components/lesson-list";
import { LessonView } from "@/components/lesson-view";
import { KEYS, writeString } from "@/lib/storage";
import { filterLessons } from "@/lib/filter";
import type { ViewMode } from "@/types";

type Props = {
  viewMode: ViewMode;
  scopeSlug: string;
};

export function BrowseShell({ viewMode, scopeSlug }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const lessonParam = params.get("lesson");

  const lessons = React.useMemo(
    () =>
      filterLessons(
        viewMode === "topic"
          ? { topicSlug: scopeSlug }
          : { codebaseSlug: scopeSlug },
      ),
    [viewMode, scopeSlug],
  );

  const activeLesson = React.useMemo(() => {
    if (lessonParam) {
      const match = lessons.find((l) => l.id === lessonParam);
      if (match) return match;
    }
    return lessons[0];
  }, [lessons, lessonParam]);

  React.useEffect(() => {
    if (viewMode === "topic") writeString(KEYS.lastTopic, scopeSlug);
    else writeString(KEYS.lastCodebase, scopeSlug);
    writeString(KEYS.viewMode, viewMode);
    if (activeLesson) writeString(KEYS.lastLesson, activeLesson.id);
  }, [viewMode, scopeSlug, activeLesson]);

  React.useEffect(() => {
    if (lessonParam || !activeLesson) return;
    const base = viewMode === "topic" ? `/topics/${scopeSlug}` : `/codebases/${scopeSlug}`;
    router.replace(`${base}?lesson=${activeLesson.id}`);
  }, [lessonParam, activeLesson, viewMode, scopeSlug, router]);

  return (
    <>
      <TopBar viewMode={viewMode} />
      {viewMode === "topic" ? (
        <TopicTabs activeSlug={scopeSlug} />
      ) : (
        <CodebaseTabs activeSlug={scopeSlug} />
      )}
      <main className="flex-1">
        <div className="mx-auto max-w-[1200px] flex">
          <LessonList
            lessons={lessons}
            activeId={activeLesson?.id}
            viewMode={viewMode}
            scopeSlug={scopeSlug}
          />
          {activeLesson ? (
            <LessonView lesson={activeLesson} />
          ) : (
            <div className="flex-1 py-10 px-6 text-muted">No lessons yet.</div>
          )}
        </div>
      </main>
    </>
  );
}
