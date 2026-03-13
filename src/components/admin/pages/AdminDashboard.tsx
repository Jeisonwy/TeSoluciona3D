import { Link, useNavigate } from "react-router-dom";
import { useMemo, CSSProperties, useState } from "react";

const API = "https://www.tesoluciona3d.com/api";

const CARDS = [
  {
    to: "/admin/products",
    label: "Productos",
    description: "Gestiona el catálogo, precios, descuentos y stock.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    accent: "#ff6a00",
    accent2: "#ee0979",
  },
  {
    to: "/admin/landing",
    label: "Imágenes del Landing",
    description: "Sube, ordena y elimina las fotos del carrusel principal.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    accent: "#9b59b6",
    accent2: "#3498db",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.4 + 0.8,
        dur: Math.random() * 8 + 5,
        delay: Math.random() * 4,
        op: Math.random() * 0.4 + 0.08,
      })),
    [],
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await fetch(`${API}/admin_logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      navigate("/admin", { replace: true });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&display=swap');

        .ad-root {
          min-height: 100vh;
          background: #060608;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          position: relative;
          overflow: hidden;
        }

        .ad-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .ad-orb1 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 650px; height: 650px; top: -220px; left: -200px;
          filter: blur(110px);
          background: radial-gradient(circle, rgba(255,106,0,0.15) 0%, transparent 70%);
          animation: ad-breathe1 6s ease-in-out infinite;
        }
        .ad-orb2 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 550px; height: 550px; bottom: -180px; right: -140px;
          filter: blur(100px);
          background: radial-gradient(circle, rgba(155,89,182,0.13) 0%, transparent 70%);
          animation: ad-breathe2 8s ease-in-out infinite;
        }
        .ad-orb3 {
          position: fixed; pointer-events: none; z-index: 0; border-radius: 50%;
          width: 400px; height: 400px; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(90px);
          background: radial-gradient(circle, rgba(238,9,121,0.07) 0%, transparent 70%);
        }
        @keyframes ad-breathe1 {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes ad-breathe2 {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.08) translate(-8px,-8px); }
        }
        .ad-scan {
          position: fixed; left: 0; height: 2px; width: 100%; z-index: 0; pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.5), transparent);
          animation: ad-scan 5s ease-in-out infinite;
        }
        @keyframes ad-scan {
          0% { top: 0%; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .ad-particle {
          position: fixed; border-radius: 50%; background: #ff6a00; pointer-events: none; z-index: 0;
          animation: ad-float ease-in-out infinite;
        }
        @keyframes ad-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-22px) scale(1.2); }
        }

        .ad-orbit-wrap {
          position: fixed; top: 50%; left: 50%;
          width: 900px; height: 900px;
          margin-left: -450px; margin-top: -450px;
          pointer-events: none; z-index: 0;
        }
        .ad-ring {
          position: absolute; border-radius: 50%; border: 1px solid;
          top: 50%; left: 50%;
        }
        .ad-r1 {
          width: 600px; height: 600px; margin: -300px 0 0 -300px;
          border-color: rgba(255,106,0,0.07);
          animation: ad-spin 20s linear infinite;
        }
        .ad-r2 {
          width: 780px; height: 780px; margin: -390px 0 0 -390px;
          border-color: rgba(155,89,182,0.05);
          border-style: dashed;
          animation: ad-spinr 30s linear infinite;
        }
        @keyframes ad-spin { to { transform: rotate(360deg); } }
        @keyframes ad-spinr { to { transform: rotate(-360deg); } }

        .ad-inner {
          position: relative; z-index: 10;
          width: 100%; max-width: 700px;
          display: flex; flex-direction: column; align-items: center;
          gap: 40px;
        }

        .ad-topbar {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }

        .ad-logout {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .ad-logout:hover {
          border-color: rgba(255,106,0,0.4);
          color: #fff;
          box-shadow: 0 0 24px rgba(255,106,0,0.15);
        }
        .ad-logout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ad-header { text-align: center; }
        .ad-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,106,0,0.1); border: 1px solid rgba(255,106,0,0.28);
          padding: 5px 16px; border-radius: 3px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,106,0,0.85); margin-bottom: 20px;
        }
        .ad-tag-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #ff6a00;
          animation: ad-pulse 1.5s ease-in-out infinite;
        }
        @keyframes ad-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.7); opacity: 0.4; }
        }
        .ad-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(42px, 7vw, 72px);
          letter-spacing: 0.1em; line-height: 0.95;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.45));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 10px;
        }
        .ad-subtitle {
          font-size: 13px; font-weight: 300; letter-spacing: 0.06em;
          color: rgba(255,255,255,0.3);
        }

        .ad-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          width: 100%;
        }
        @media (max-width: 560px) {
          .ad-cards { grid-template-columns: 1fr; }
        }

        .ad-card {
          position: relative;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 28px 24px;
          text-decoration: none;
          color: #fff;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 16px;
          overflow: hidden;
          transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .ad-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: var(--card-gradient);
          opacity: 0.7;
        }
        .ad-card::after {
          content: '';
          position: absolute; inset: 0; border-radius: 18px;
          background: radial-gradient(ellipse at 50% -20%, var(--card-glow) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .ad-card:hover { transform: translateY(-5px); }
        .ad-card:hover::after { opacity: 1; }

        .ad-cc { position: absolute; width: 12px; height: 12px; }
        .ad-cc-tl { top: 10px; left: 10px; border-top: 2px solid var(--card-accent); border-left: 2px solid var(--card-accent); opacity: 0.5; }
        .ad-cc-tr { top: 10px; right: 10px; border-top: 2px solid var(--card-accent); border-right: 2px solid var(--card-accent); opacity: 0.5; }
        .ad-cc-bl { bottom: 10px; left: 10px; border-bottom: 2px solid var(--card-accent); border-left: 2px solid var(--card-accent); opacity: 0.5; }
        .ad-cc-br { bottom: 10px; right: 10px; border-bottom: 2px solid var(--card-accent); border-right: 2px solid var(--card-accent); opacity: 0.5; }

        .ad-card-icon {
          width: 62px; height: 62px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          background: var(--card-icon-bg);
          border: 1px solid var(--card-accent-border);
          animation: ad-icon-glow 3s ease-in-out infinite;
        }
        @keyframes ad-icon-glow {
          0%,100% { box-shadow: 0 0 14px var(--card-glow); }
          50% { box-shadow: 0 0 36px var(--card-glow); }
        }
        .ad-card-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px; letter-spacing: 0.1em;
          background: linear-gradient(135deg, #fff, rgba(255,255,255,0.65));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ad-card-desc {
          font-size: 12px; font-weight: 300; line-height: 1.65;
          color: rgba(255,255,255,0.35);
          flex: 1;
        }
        .ad-card-cta {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--card-accent-text);
          background: var(--card-cta-bg);
          border: 1px solid var(--card-accent-border);
          border-radius: 7px; padding: 8px 18px;
          transition: filter 0.2s;
        }
        .ad-card:hover .ad-card-cta { filter: brightness(1.2); }

        .ad-footer {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.15);
        }
        .ad-footer-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,106,0,0.4); }
      `}</style>

      <div className="ad-grid" />
      <div className="ad-orb1" />
      <div className="ad-orb2" />
      <div className="ad-orb3" />
      <div className="ad-scan" />
      <div className="ad-orbit-wrap">
        <div className="ad-ring ad-r1" />
        <div className="ad-ring ad-r2" />
      </div>

      {particles.map((p) => (
        <span
          key={p.id}
          className="ad-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.op,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="ad-root">
        <div className="ad-inner">
          <div className="ad-topbar">
            <button
              type="button"
              className="ad-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              {loggingOut ? "Saliendo..." : "Cerrar sesión"}
            </button>
          </div>

          <div className="ad-header">
            <div className="ad-tag">
              <span className="ad-tag-dot" />
              Tesoluciona3D
            </div>
            <div className="ad-title">
              Panel de
              <br />
              Administración
            </div>
            <div className="ad-subtitle">
              Selecciona una sección para continuar
            </div>
          </div>

          <div className="ad-cards">
            {CARDS.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="ad-card"
                style={
                  {
                    "--card-accent": card.accent,
                    "--card-accent-text": card.accent,
                    "--card-accent-border": `${card.accent}44`,
                    "--card-gradient": `linear-gradient(90deg, transparent, ${card.accent}80, transparent)`,
                    "--card-glow": `${card.accent}33`,
                    "--card-icon-bg": `${card.accent}18`,
                    "--card-cta-bg": `${card.accent}12`,
                  } as CSSProperties
                }
              >
                <span className="ad-cc ad-cc-tl" />
                <span className="ad-cc ad-cc-tr" />
                <span className="ad-cc ad-cc-bl" />
                <span className="ad-cc ad-cc-br" />

                <div className="ad-card-icon" style={{ color: card.accent }}>
                  {card.icon}
                </div>

                <div className="ad-card-label">{card.label}</div>
                <div className="ad-card-desc">{card.description}</div>

                <div className="ad-card-cta">
                  Ir al módulo
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="ad-footer">
            Tesoluciona3D
            <span className="ad-footer-dot" />
            Admin v1.0
            <span className="ad-footer-dot" />
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
}
