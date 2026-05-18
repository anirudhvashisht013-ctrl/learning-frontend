"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={cn("relative inline-flex group", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5",
          "whitespace-nowrap rounded-md bg-ink text-paper text-[11px] font-medium px-2 py-1",
          "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
      >
        {label}
      </span>
    </span>
  );
}
