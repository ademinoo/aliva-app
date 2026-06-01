/**
 * Splash screen Aliva.
 * Composant serveur pur — styles embarqués dans <style> pour garantir
 * le chargement des keyframes indépendamment de Tailwind.
 */
export function SplashScreen() {
  return (
    <>
      {/* Styles auto-contenus : aucune dépendance externe */}
      <style>{`
        #aliva-splash {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f7f4ef;
          animation: _sp_exit 0.7s ease 2.5s forwards;
        }

        @keyframes _sp_exit {
          0%   { opacity: 1; visibility: visible; }
          99%  { opacity: 0; visibility: visible; }
          100% { opacity: 0; visibility: hidden;  }
        }

        #aliva-splash .sp-ring {
          position: absolute;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          opacity: 0;
        }
        #aliva-splash .sp-ring-1 {
          border: 1.5px solid #1e5c3a;
          animation: _sp_ring 2.2s cubic-bezier(0.22,1,0.36,1) 0.4s forwards;
        }
        #aliva-splash .sp-ring-2 {
          border: 1px solid #cce8d8;
          animation: _sp_ring 2.4s cubic-bezier(0.22,1,0.36,1) 0.8s forwards;
        }
        @keyframes _sp_ring {
          0%   { transform: scale(0.75); opacity: 0.5; }
          100% { transform: scale(2.5);  opacity: 0;   }
        }

        #aliva-splash .sp-leaf {
          animation:
            _sp_leaf_in 0.9s cubic-bezier(0.22,1,0.36,1) both,
            _sp_breathe 3.5s ease-in-out 0.9s infinite;
        }
        @keyframes _sp_leaf_in {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);   }
        }
        @keyframes _sp_breathe {
          0%, 100% { transform: scale(1);    }
          50%      { transform: scale(1.06); }
        }

        #aliva-splash .sp-name {
          margin-top: 22px;
          font-family: Georgia, serif;
          font-size: 1.85rem;
          font-weight: 300;
          color: #1e5c3a;
          letter-spacing: 0.02em;
          animation: _sp_text 0.8s cubic-bezier(0.22,1,0.36,1) 0.45s both;
        }
        #aliva-splash .sp-sub {
          margin-top: 10px;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #5b5b56;
          animation: _sp_text 0.8s cubic-bezier(0.22,1,0.36,1) 0.75s both;
        }
        @keyframes _sp_text {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        #aliva-splash .sp-dots {
          display: flex;
          gap: 8px;
          margin-top: 44px;
          animation: _sp_text 0.6s ease 1.1s both;
        }
        #aliva-splash .sp-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #cce8d8;
        }
        #aliva-splash .sp-dot:nth-child(1) { animation: _sp_dot 1.4s ease-in-out 0s    infinite; }
        #aliva-splash .sp-dot:nth-child(2) { animation: _sp_dot 1.4s ease-in-out 0.22s infinite; }
        #aliva-splash .sp-dot:nth-child(3) { animation: _sp_dot 1.4s ease-in-out 0.44s infinite; }
        @keyframes _sp_dot {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%      { opacity: 1;    transform: scale(1);   }
        }
      `}</style>

      <div id="aliva-splash" aria-hidden="true">
        {/* Anneaux */}
        <div className="sp-ring sp-ring-1" />
        <div className="sp-ring sp-ring-2" />

        {/* Feuille */}
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

        {/* Textes */}
        <p className="sp-name">Aliva</p>
        <p className="sp-sub">Un univers VIVUM</p>

        {/* Points */}
        <div className="sp-dots">
          <span className="sp-dot" />
          <span className="sp-dot" />
          <span className="sp-dot" />
        </div>
      </div>
    </>
  );
}
