"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-md border border-rule bg-transparent px-3 text-sm",
        "placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        "transition-colors",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
