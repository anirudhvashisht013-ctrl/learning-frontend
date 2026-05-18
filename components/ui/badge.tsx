import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "accent" | "muted";

const variantClasses: Record<Variant, string> = {
  default: "bg-accent-soft text-accent border border-transparent",
  accent: "bg-accent text-white border border-transparent",
  outline: "bg-transparent text-ink border border-rule",
  muted: "bg-transparent text-muted border border-rule",
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 h-5 rounded-full text-[11px] font-medium tracking-wide",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
