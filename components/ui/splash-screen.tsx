"use client";

import { useEffect, useState } from "react";

/**
 * Écran de démarrage zen — visible dès le premier rendu,
 * disparaît après ~3s avec un fondu doux.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 2500);
    const t2 = setTimeout(() => setVisible(false), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         999,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        backgroundColor:"#f7f4ef",
        opacity:         fading ? 0 : 1,
        transition:     "opacity 0.7s ease",
        pointerEvents:   fading ? "none" : "all",
      }}
    >
      {/* Anneau expansif */}
      <div style={{
        position:     "absolute",
        width:        96,
        height:       96,
        borderRadius: "50%",
        border:       "1.5px solid #1e5c3a",
        animation:    "splash-ring 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards",
        opacity:      0,
      }} />

      {/* Second anneau, plus doux */}
      <div style={{
        position:     "absolute",
        width:        96,
        height:       96,
        borderRadius: "50%",
        border:       "1px solid #cce8d8",
        animation:    "splash-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) 0.9s forwards",
        opacity:      0,
      }} />

      {/* Logo feuille */}
      <div style={{
        animation: "splash-leaf-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both, splash-breathe 3.5s ease-in-out 0.9s infinite",
      }}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1e5c3a"
          strokeWidth="1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 48, height: 48 }}
        >
          <path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11" />
          <path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11" />
          <path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11" />
          <line x1="12" y1="15" x2="12" y2="20" />
        </svg>
      </div>

      {/* "Aliva" */}
      <p style={{
        marginTop:     20,
        fontFamily:    "var(--font-literata), Georgia, serif",
        fontSize:      "1.85rem",
        fontWeight:    300,
        color:         "#1e5c3a",
        letterSpacing: "0.02em",
        animation:     "splash-text-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s both",
      }}>
        Aliva
      </p>

      {/* "Un univers VIVUM" */}
      <p style={{
        marginTop:     10,
        fontSize:      "0.6rem",
        fontWeight:    600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color:         "#5b5b56",
        animation:     "splash-text-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both",
      }}>
        Un univers VIVUM
      </p>

      {/* Points de chargement */}
      <div style={{
        display:   "flex",
        gap:       8,
        marginTop: 40,
        animation: "splash-text-in 0.6s ease 1.1s both",
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            display:         "block",
            width:           5,
            height:          5,
            borderRadius:    "50%",
            backgroundColor: "#cce8d8",
            animation:       `splash-dot 1.4s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
