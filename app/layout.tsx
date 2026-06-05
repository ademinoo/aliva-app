import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
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
  icons: {
    apple: "/logo-aliva-iphone.png",
  },
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
      className={`${fraunces.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">

        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <style precedence="high">{`
          #aliva-sp {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%;
            z-index: 2147483647;
            background-color: #f7f4ef;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: sp-exit 0.8s ease 2.5s forwards;
          }
          @keyframes sp-exit {
            from { opacity: 1; }
            to   { opacity: 0; visibility: hidden; }
          }
          .sp-leaf {
            animation: sp-in 0.9s cubic-bezier(.22,1,.36,1) both,
                       sp-breathe 3.5s ease-in-out 0.9s infinite;
          }
          @keyframes sp-in {
            from { opacity: 0; transform: scale(.8) translateY(8px); }
            to   { opacity: 1; transform: scale(1)  translateY(0);   }
          }
          @keyframes sp-breathe {
            0%,100% { transform: scale(1);    }
            50%     { transform: scale(1.06); }
          }
          .sp-name { animation: sp-txt .8s cubic-bezier(.22,1,.36,1) .5s both; }
          .sp-sub  { animation: sp-txt .8s cubic-bezier(.22,1,.36,1) .8s both; }
          @keyframes sp-txt {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          .sp-dots { animation: sp-txt .6s ease 1.1s both; }
          .sp-dot  { animation: sp-dot 1.4s ease-in-out infinite; }
          .sp-dot:nth-child(2) { animation-delay: .22s; }
          .sp-dot:nth-child(3) { animation-delay: .44s; }
          @keyframes sp-dot {
            0%,100% { opacity: .25; transform: scale(.8); }
            50%     { opacity: 1;   transform: scale(1);  }
          }
        `}</style>

        <div id="aliva-sp" aria-hidden="true">
          <div className="sp-leaf">
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
          </div>

          <p className="sp-name" style={{
            marginTop: 22,
            fontFamily: "Georgia, serif",
            fontSize: "1.85rem",
            fontWeight: 300,
            color: "#1e5c3a",
            letterSpacing: "0.02em",
          }}>
            Aliva
          </p>

          <p className="sp-sub" style={{
            marginTop: 10,
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#5b5b56",
          }}>
            Un univers VIVUM
          </p>

          <div className="sp-dots" style={{
            display: "flex",
            gap: 8,
            marginTop: 44,
          }}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="sp-dot" style={{
                display: "block",
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "#cce8d8",
              }} />
            ))}
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
