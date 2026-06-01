import type { Metadata, Viewport } from "next";
import { Literata, Nunito_Sans } from "next/font/google";
import "./globals.css";

// Titres display — le serif chaleureux et moderne d'Aliva
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
});

// Corps de texte et interface
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
