import type { Metadata, Viewport } from "next";
import { Literata, Nunito_Sans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${literata.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Splash screen — rendu serveur, dans l'arbre React (pas de suppression
          à l'hydratation). Le <style precedence> est hissé dans le <head> par
          React 18 avant tout rendu, donc la CSS est appliquée dès le premier pixel.
        */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore — precedence est un prop React 18 non encore typé */}
        <style precedence="high">{`
          #aliva-sp {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background-color: #1e5c3a;
            display: -webkit-flex;
            display: flex;
            -webkit-flex-direction: column;
            flex-direction: column;
            -webkit-align-items: center;
            align-items: center;
            -webkit-justify-content: center;
            justify-content: center;
            -webkit-animation: sp-exit 0.8s ease 8s forwards;
            animation: sp-exit 0.8s ease 8s forwards;
          }
          @-webkit-keyframes sp-exit {
            from { opacity: 1; }
            to   { opacity: 0; visibility: hidden; }
          }
          @keyframes sp-exit {
            from { opacity: 1; }
            to   { opacity: 0; visibility: hidden; }
          }
        `}</style>

        <div id="aliva-sp" aria-hidden="true">
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
          <p style={{
            marginTop: 22,
            fontFamily: "Georgia, serif",
            fontSize: "1.85rem",
            fontWeight: 300,
            color: "#1e5c3a",
            letterSpacing: "0.02em",
          color: "#ffffff",
          }}>
            Aliva
          </p>
          <p style={{
            marginTop: 10,
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}>
            Un univers VIVUM
          </p>
        </div>

        {children}
      </body>
    </html>
  );
}
