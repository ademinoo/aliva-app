"use client";

import { useEffect, useRef } from "react";

/**
 * Splash Aliva.
 * - Rendu serveur : le div est dans le HTML initial avec opacity 1
 * - Exit piloté par JS uniquement : aucune animation CSS pour éviter
 *   les problèmes de timing avec le chargement des styles
 */
export function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fade out après 2.5s
    const t1 = setTimeout(() => {
      el.style.transition = "opacity 0.8s ease";
      el.style.opacity = "0";
    }, 2500);

    // Retire du flux après le fondu
    const t2 = setTimeout(() => {
      el.style.display = "none";
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position:        "fixed",
        top:             0,
        left:            0,
        right:           0,
        bottom:          0,
        zIndex:          9999,
        backgroundColor: "#f7f4ef",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
      }}
    >
      {/* Logo feuille */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e5c3a"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="52"
        height="52"
      >
        <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
        <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
        <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
        <line x1="12" y1="15" x2="12" y2="20" />
      </svg>

      {/* Nom */}
      <p style={{
        marginTop:     22,
        fontFamily:    "Georgia, serif",
        fontSize:      "1.85rem",
        fontWeight:    300,
        color:         "#1e5c3a",
        letterSpacing: "0.02em",
      }}>
        Aliva
      </p>

      {/* Signature */}
      <p style={{
        marginTop:     10,
        fontSize:      "0.6rem",
        fontWeight:    600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color:         "#5b5b56",
      }}>
        Un univers VIVUM
      </p>
    </div>
  );
}
