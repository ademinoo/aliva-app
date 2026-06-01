import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Conteneur mobile-first : largeur confortable, marges latérales,
 * beaucoup d'espace — jamais de surcharge visuelle.
 */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-xl px-5 sm:px-6", className)}
      {...props}
    />
  );
}
