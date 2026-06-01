import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface légèrement teintée (vert pâle) pour les blocs mis en avant. */
  tone?: "default" | "soft";
}

export function Card({ className, tone = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border p-6",
        tone === "soft"
          ? "border-aliva-pale bg-aliva-pale/30"
          : "border-black/5 bg-white/60",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-medium text-aliva", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-2 text-sm leading-relaxed text-ink-soft", className)}
      {...props}
    />
  );
}
