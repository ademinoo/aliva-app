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

        {/* ── Splash screen ── HTML + style embarqués directement ── */}
        <style>{`
          #_sp {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 9999;
            background: #f7f4ef;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: _sp_out 0.7s ease 2.5s forwards;
          }
          @keyframes _sp_out {
            0%   { opacity: 1; }
            100% { opacity: 0; pointer-events: none; visibility: hidden; }
          }
          #_sp svg {
            animation: _sp_in 0.9s cubic-bezier(.22,1,.36,1) both,
                       _sp_br 3.5s ease-in-out 0.9s infinite;
          }
          @keyframes _sp_in {
            from { opacity: 0; transform: scale(.8) translateY(8px); }
            to   { opacity: 1; transform: scale(1)  translateY(0);   }
          }
          @keyframes _sp_br {
            0%,100% { transform: scale(1);    }
            50%     { transform: scale(1.06); }
          }
          #_sp p:first-of-type {
            margin-top: 22px;
            font-family: Georgia, serif;
            font-size: 1.85rem;
            font-weight: 300;
            color: #1e5c3a;
            letter-spacing: .02em;
            animation: _sp_txt .8s cubic-bezier(.22,1,.36,1) .45s both;
          }
          #_sp p:last-of-type {
            margin-top: 10px;
            font-size: .6rem;
            font-weight: 600;
            letter-spacing: .22em;
            text-transform: uppercase;
            color: #5b5b56;
            animation: _sp_txt .8s cubic-bezier(.22,1,.36,1) .75s both;
          }
          @keyframes _sp_txt {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
        `}</style>

        <div id="_sp" aria-hidden="true">
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
          <p>Aliva</p>
          <p>Un univers VIVUM</p>
        </div>
        {/* ── fin splash ── */}

        {children}
      </body>
    </html>
  );
}
