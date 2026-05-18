"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  language?: string;
  annotation?: string;
  className?: string;
};

export function CodeBlock({ code, language, annotation, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };

  return (
    <figure className={cn("group relative my-4", className)}>
      <pre className="overflow-x-auto rounded-lg border border-rule bg-code p-4 font-mono text-[13px] leading-6 text-ink">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        className={cn(
          "absolute top-2 right-2 inline-flex items-center justify-center h-7 w-7 rounded-md",
          "bg-paper border border-rule text-muted opacity-0 group-hover:opacity-100",
          "hover:text-accent transition",
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      {(annotation || language) && (
        <figcaption className="mt-1.5 text-[11px] text-muted font-sans flex justify-between">
          <span>{annotation}</span>
          {language && <span className="font-mono">{language}</span>}
        </figcaption>
      )}
    </figure>
  );
}
