"use client";

import { useEffect } from "react";

/**
 * Déclenche le fondu du splash via document.getElementById.
 * Le div #aliva-sp est rendu côté serveur — React ne le supprime pas.
 * Ce composant ne fait que piloter sa disparition côté client.
 */
export function SplashFader() {
  useEffect(() => {
    const el = document.getElementById("aliva-sp");
    if (!el) return;

    const t1 = setTimeout(() => {
      el.style.transition = "opacity 0.8s ease";
      el.style.opacity = "0";
    }, 2500);

    const t2 = setTimeout(() => {
      el.style.display = "none";
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
