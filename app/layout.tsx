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

/* ──────────────────────────────────────────────────────────
   Script splash — crée le div AVANT que React charge,
   donc jamais masqué par l'hydratation.
   Exécuté par le parser HTML dès que le tag <script> est lu.
────────────────────────────────────────────────────────── */
const splashScript = `(function(){
  var d=document.createElement('div');
  d.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#f7f4ef;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:all';
  d.innerHTML=
    '<svg viewBox="0 0 24 24" fill="none" stroke="#1e5c3a" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" width="52" height="52">'
    +'<path d="M12 15 C9 13 6 9 8 5 C10.5 3.5 13 7 12 11"/>'
    +'<path d="M12 15 C15 13 18 9 16 5 C13.5 3.5 11 7 12 11"/>'
    +'<path d="M12 11 C11 8 12 5.5 12 5.5 C12 5.5 13 8 12 11"/>'
    +'<line x1="12" y1="15" x2="12" y2="20"/>'
    +'</svg>'
    +'<p style="margin-top:22px;font-family:Georgia,serif;font-size:1.85rem;font-weight:300;color:#1e5c3a;letter-spacing:.02em">Aliva</p>'
    +'<p style="margin-top:10px;font-size:.6rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#5b5b56">Un univers VIVUM</p>';
  document.body.appendChild(d);
  setTimeout(function(){
    d.style.transition='opacity .8s ease';
    d.style.opacity='0';
    setTimeout(function(){d.remove();},850);
  },2500);
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${literata.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Script exécuté avant React — aucune dépendance framework */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
        {children}
      </body>
    </html>
  );
}
