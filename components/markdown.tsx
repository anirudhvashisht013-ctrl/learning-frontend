"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";
import { useLessonPanel } from "@/lib/lesson-panel-context";

export default function Markdown({ children }: { children: string }) {
  const { openLesson } = useLessonPanel();

  const components: Components = React.useMemo(
    () => ({
      // Intercept `lesson://lesson-id` links and open them in the side panel.
      a({ href, children, node, ...props }) {
        if (href?.startsWith("lesson://")) {
          const lessonId = href.replace("lesson://", "");
          return (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openLesson(lessonId);
              }}
              className="inline text-accent underline decoration-dotted underline-offset-2 hover:decoration-solid cursor-pointer bg-transparent border-0 p-0 font-[inherit]"
            >
              {children}
              <span
                aria-hidden
                className="ml-0.5 inline-block -translate-y-px text-[0.75em] opacity-60"
              >
                ↗
              </span>
            </button>
          );
        }
        // Normal links behave as before.
        const external = href?.startsWith("http");
        return (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            {...props}
          >
            {children}
          </a>
        );
      },
      // react-markdown v10 no longer passes `inline`; treat a fenced/multi-line
      // code node (has a language- class or contains a newline) as a block.
      code({ className, children, node, ...props }) {
        const text = String(children ?? "");
        const match = /language-(\w+)/.exec(className ?? "");
        const isBlock = Boolean(match) || text.includes("\n");

        if (isBlock) {
          return <CodeBlock code={text.replace(/\n$/, "")} language={match?.[1] ?? ""} />;
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      // Unwrap the default <pre> so block code renders through CodeBlock's own markup.
      pre({ children }) {
        return <>{children}</>;
      },
    }),
    [openLesson],
  );

  return (
    <div className="prose-notebook">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
