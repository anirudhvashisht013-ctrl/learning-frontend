"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface LessonPanelState {
  isOpen: boolean;
  currentLessonId: string | null;
  history: string[]; // for back navigation within the panel
}

interface LessonPanelContextValue {
  state: LessonPanelState;
  openLesson: (lessonId: string) => void;
  closeLesson: () => void;
  goBack: () => void;
}

const LessonPanelContext = createContext<LessonPanelContextValue | null>(null);

export function LessonPanelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LessonPanelState>({
    isOpen: false,
    currentLessonId: null,
    history: [],
  });

  const openLesson = useCallback((lessonId: string) => {
    setState((prev) => {
      // If panel is already open with a different lesson, push current to history
      if (prev.isOpen && prev.currentLessonId && prev.currentLessonId !== lessonId) {
        return {
          isOpen: true,
          currentLessonId: lessonId,
          history: [...prev.history, prev.currentLessonId],
        };
      }
      return {
        isOpen: true,
        currentLessonId: lessonId,
        history: prev.history,
      };
    });
  }, []);

  const closeLesson = useCallback(() => {
    setState({ isOpen: false, currentLessonId: null, history: [] });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) {
        // No history, close panel
        return { isOpen: false, currentLessonId: null, history: [] };
      }
      const newHistory = [...prev.history];
      const previousLessonId = newHistory.pop()!;
      return {
        isOpen: true,
        currentLessonId: previousLessonId,
        history: newHistory,
      };
    });
  }, []);

  return (
    <LessonPanelContext.Provider value={{ state, openLesson, closeLesson, goBack }}>
      {children}
    </LessonPanelContext.Provider>
  );
}

export function useLessonPanel() {
  const ctx = useContext(LessonPanelContext);
  if (!ctx) {
    throw new Error("useLessonPanel must be used within LessonPanelProvider");
  }
  return ctx;
}
