import type { Metadata, Viewport } from "next";
import { Literata, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SplashFader } from "@/components/ui/splash-fader";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aliva — Ton alliée santé",
  description:
    "Aliva croise les sagesses médicales du monde avec tes données pour te transmettre, chaque jour, le geste juste. Accompagnement éducatif au bien-être. Un univers VIVUM.",
};

export const viewport: Viewport = {
  themeColor: "#f7f4ef",
  width: "device-width",
  initialScale: 1,
};

/* Styles inline — zéro dépendance CSS externe, pas de chargement async */
const SP: React.CSSProperties = {
  position:        "fixed",
  top:             0,
  left:            0,
  right:           0,
  bottom:          0,
  width:           "100%",
  height:          "100%",
  zIndex:          2147483647,          // z-index maximum possible
  backgroundColor: "#1e5c3a",          // vert foncé — visible immédiatement
  display:         "flex",
  flexDirection:   "column",
  alignItems:      "center",
  justifyContent:  "center",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${literata.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">

        {/* Splash serveur — rendu dans l'arbre React, jamais supprimé */}
        <div id="aliva-sp" aria-hidden="true" style={SP}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
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
          <p style={{
            marginTop:     22,
            fontFamily:    "Georgia, serif",
            fontSize:      "1.85rem",
            fontWeight:    300,
            color:         "#ffffff",
            letterSpacing: "0.02em",
          }}>
            Aliva
          </p>
          <p style={{
            marginTop:     10,
            fontSize:      "0.6rem",
            fontWeight:    600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         "rgba(255,255,255,0.6)",
          }}>
            Un univers VIVUM
          </p>
        </div>

        {/* Pilote la disparition côté client */}
        <SplashFader />

        {children}
      </body>
    </html>
  );
}
