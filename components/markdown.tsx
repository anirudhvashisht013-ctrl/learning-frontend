"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";

const components: Components = {
  // react-markdown v10 no longer passes `inline`; treat a fenced/multi-line
  // code node (has a language- class or contains a newline) as a block.
  code({ className, children, ...props }) {
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
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-notebook">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
