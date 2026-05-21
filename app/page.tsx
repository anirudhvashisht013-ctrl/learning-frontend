"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KEYS, readString, readViewMode } from "@/lib/storage";
import { topics, codebases, getCodebase, getTopic } from "@/lib/data";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const mode = readViewMode();
    if (mode === "codebase") {
      const saved = readString(KEYS.lastCodebase);
      const slug = (saved && getCodebase(saved) ? saved : codebases[0]?.slug);
      router.replace(`/codebases/${slug}`);
    } else {
      const saved = readString(KEYS.lastTopic);
      const slug = (saved && getTopic(saved) ? saved : topics[0]?.slug);
      router.replace(`/topics/${slug}`);
    }
  }, [router]);

  return (
    <div className="flex-1 flex items-center justify-center text-muted text-sm">
      Loading your notebook…
    </div>
  );
}
