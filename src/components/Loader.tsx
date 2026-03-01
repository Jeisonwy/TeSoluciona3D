import React, { useEffect, useState, useMemo } from "react";

const PROD_URL =
  "https://script.google.com/macros/s/AKfycbz4qsIjQzuk64K4l9IlZ_qcA0pZVXge5mo7FfJB7gh0F4R5d3qks_Vphe0kcRVLYSQdaA/exec?action=products";
const PROMO_URL =
  "https://script.google.com/macros/s/AKfycbz4qsIjQzuk64K4l9IlZ_qcA0pZVXge5mo7FfJB7gh0F4R5d3qks_Vphe0kcRVLYSQdaA/exec?action=promotions";

export default function Loader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [printedLines, setPrintedLines] = useState(0);
  const [statusText, setStatusText] = useState("Cargando base de datos...");

  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.4 + 0.6,
        duration: Math.random() * 7 + 4,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.5 + 0.1,
      })),
    [],
  );

  // Efecto de las líneas impresas (sin cambios)
  useEffect(() => {
    let line = 0;
    const iv = setInterval(() => {
      line++;
      setPrintedLines(line);
      if (line >= 12) clearInterval(iv);
    }, 160);
    return () => clearInterval(iv);
  }, []);

  // MASTER EFFECT: Carga de APIs, Temporizador visual y Salida
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // 1. Iniciar animación de la barra hasta un máximo del 90%
      const start = Date.now();
      const duration = 2000;
      const animateProgress = () => {
        if (!isMounted) return;
        const elapsed = Date.now() - start;
        const raw = Math.min(elapsed / duration, 1);
        const p = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2; // easeInOut curve
        setProgress(p * 90); // Se estanca en 90% hasta que las promesas resuelvan
        if (raw < 1) requestAnimationFrame(animateProgress);
      };
      requestAnimationFrame(animateProgress);

      // 2. Definir el tiempo mínimo que queremos que se vea la animación (2.4 segundos)
      const minTimePromise = new Promise((resolve) =>
        setTimeout(resolve, 2400),
      );

      // 3. Promesa para descargar Productos y guardarlos en SessionStorage
      const productsPromise = fetch(PROD_URL)
        .then((r) => r.json())
        .then((json) => {
          if (json?.success && Array.isArray(json.data)) {
            // Normalizamos igual que en tu componente Products.tsx
            const normalized = json.data.map((p: any) => ({
              ...p,
              cost: Number(p.cost) || 0,
              discount: Number(p.discount) || 0,
            }));
            sessionStorage.setItem(
              `products_cache_${PROD_URL}`,
              JSON.stringify(normalized),
            );
          }
        })
        .catch((err) => console.error("Error cargando productos:", err));

      // 4. Promesa para descargar Promociones y guardarlas en SessionStorage
      const promosPromise = fetch(PROMO_URL)
        .then((r) => r.json())
        .then((json) => {
          if (json?.success && Array.isArray(json.data)) {
            // Normalizamos igual que en tu componente Promotions.tsx
            const normalized = json.data.map((p: any) => ({
              ...p,
              cost: Number(p.cost) || 0,
              discount: Number(p.discount) || 0,
              status: Boolean(p.status),
              showMainPromotion: Boolean(p.showMainPromotion),
              TypeOfEvent: String(p.TypeOfEvent ?? ""),
            }));
            sessionStorage.setItem(
              `promotions_cache_${PROMO_URL}`,
              JSON.stringify(normalized),
            );
          }
        })
        .catch((err) => console.error("Error cargando promociones:", err));

      // 5. ESPERAR a que las 3 cosas terminen simultáneamente
      await Promise.all([minTimePromise, productsPromise, promosPromise]);

      if (!isMounted) return;

      // 6. Finalizar
      setProgress(100);
      setStatusText("¡Sistema listo!");

      setTimeout(() => {
        if (isMounted) setExiting(true);
      }, 300);

      setTimeout(() => {
        if (isMounted) setLoading(false);
      }, 800);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loading) return <>{children}</>;

  return (
    <>
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');



        .ld-root {

          position: fixed; inset: 0; z-index: 9999;

          background: #060608;

          display: flex; align-items: center; justify-content: center;

          overflow: hidden;

          transition: opacity 0.5s ease, transform 0.5s ease;

        }

        .ld-root.exit { opacity: 0; transform: scale(1.04); pointer-events: none; }



        /* Grid */

        .ld-grid {

          position: absolute; inset: 0;

          background-image:

            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),

            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);

          background-size: 52px 52px;

        }



        /* Scanline */

        .ld-scan {

          position: absolute; left: 0; height: 2px; width: 100%;

          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.7), transparent);

          animation: ld-scan 3s ease-in-out infinite;

        }

        @keyframes ld-scan {

          0%   { top: 0%;   opacity: 0; }

          8%   { opacity: 1; }

          92%  { opacity: 1; }

          100% { top: 100%; opacity: 0; }

        }



        /* Particles */

        .ld-particle {

          position: absolute; border-radius: 50%; background: #ff6a00;

          animation: ld-float ease-in-out infinite;

        }

        @keyframes ld-float {

          0%,100% { transform: translateY(0) scale(1); }

          50%      { transform: translateY(-24px) scale(1.2); }

        }



        /* Orbs */

        .ld-orb1 {

          position: absolute; border-radius: 50%;

          width: 600px; height: 600px;

          top: -180px; left: -180px;

          filter: blur(100px);

          background: radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%);

          animation: ld-breathe1 5s ease-in-out infinite;

        }

        .ld-orb2 {

          position: absolute; border-radius: 50%;

          width: 500px; height: 500px;

          bottom: -150px; right: -100px;

          filter: blur(100px);

          background: radial-gradient(circle, rgba(238,9,121,0.14) 0%, transparent 70%);

          animation: ld-breathe2 6s ease-in-out infinite;

        }

        @keyframes ld-breathe1 {

          0%,100% { transform: scale(1); }

          50%      { transform: scale(1.12); }

        }

        @keyframes ld-breathe2 {

          0%,100% { transform: scale(1); }

          50%      { transform: scale(1.1) translate(-10px, -10px); }

        }



        /* ─── CENTER PIECE ─── */

        .ld-center {

          position: relative; z-index: 10;

          display: flex; flex-direction: column;

          align-items: center; gap: 0;

        }



        /* Rings */

        .ld-rings {

          position: relative; width: 220px; height: 220px;

          display: flex; align-items: center; justify-content: center;

          margin-bottom: 40px;

        }

        .ld-ring {

          position: absolute; border-radius: 50%; border: 1px solid;

          top: 50%; left: 50%;

        }

        .ld-r1 {

          width: 200px; height: 200px;

          margin-left: -100px; margin-top: -100px;

          border-color: rgba(255,106,0,0.5);

          animation: ld-spin 8s linear infinite;

        }

        .ld-r2 {

          width: 160px; height: 160px;

          margin-left: -80px; margin-top: -80px;

          border-color: rgba(238,9,121,0.4);

          border-style: dashed;

          animation: ld-spinr 6s linear infinite;

        }

        .ld-r3 {

          width: 260px; height: 260px;

          margin-left: -130px; margin-top: -130px;

          border-color: rgba(155,89,182,0.25);

          animation: ld-spin 14s linear infinite;

        }

        .ld-r4 {

          width: 300px; height: 300px;

          margin-left: -150px; margin-top: -150px;

          border-color: rgba(255,106,0,0.1);

          border-style: dotted;

          animation: ld-spinr 20s linear infinite;

        }

        @keyframes ld-spin  { to { transform: rotate(360deg); } }

        @keyframes ld-spinr { to { transform: rotate(-360deg); } }



        /* Orbit dots */

        .ld-dot {

          position: absolute;

          width: 8px; height: 8px;

          border-radius: 50%;

          top: 50%; left: 50%;

          margin-left: -4px; margin-top: -4px;

        }

        .ld-dot-a {

          background: #ff6a00;

          box-shadow: 0 0 14px #ff6a00;

          animation: ld-orbit-a 8s linear infinite;

        }

        .ld-dot-b {

          background: #ee0979; width: 6px; height: 6px;

          margin-left: -3px; margin-top: -3px;

          box-shadow: 0 0 10px #ee0979;

          animation: ld-orbit-b 6s linear infinite reverse;

        }

        .ld-dot-c {

          background: #9b59b6; width: 5px; height: 5px;

          margin-left: -2.5px; margin-top: -2.5px;

          box-shadow: 0 0 8px #9b59b6;

          animation: ld-orbit-c 14s linear infinite;

        }

        @keyframes ld-orbit-a {

          from { transform: rotate(0deg) translateX(100px); }

          to   { transform: rotate(360deg) translateX(100px); }

        }

        @keyframes ld-orbit-b {

          from { transform: rotate(0deg) translateX(80px); }

          to   { transform: rotate(360deg) translateX(80px); }

        }

        @keyframes ld-orbit-c {

          from { transform: rotate(45deg) translateX(130px); }

          to   { transform: rotate(405deg) translateX(130px); }

        }



        /* Hex core */

        .ld-hex {

          width: 90px; height: 90px;

          clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);

          background: linear-gradient(135deg, rgba(255,106,0,0.2), rgba(238,9,121,0.12));

          border: 1px solid rgba(255,106,0,0.45);

          display: flex; align-items: center; justify-content: center;

          animation: ld-hexglow 2.5s ease-in-out infinite;

        }

        @keyframes ld-hexglow {

          0%,100% { box-shadow: 0 0 20px rgba(255,106,0,0.3); }

          50%      { box-shadow: 0 0 60px rgba(255,106,0,0.6); }

        }



        /* 3D print layers */

        .ld-layers {

          position: absolute;

          right: -64px; top: 50%;

          transform: translateY(-50%);

          display: flex; flex-direction: column-reverse; gap: 3px;

        }

        .ld-layer {

          height: 4px; border-radius: 2px;

          background: linear-gradient(90deg, #ff6a00, #ee0979);

          transform-origin: left;

          animation: ld-layer-in 0.2s ease both;

        }

        @keyframes ld-layer-in {

          from { transform: scaleX(0); opacity: 0; }

          to   { transform: scaleX(1); opacity: 1; }

        }



        /* Brand */

        .ld-brand {

          font-family: 'Bebas Neue', sans-serif;

          font-size: 42px;

          letter-spacing: 0.12em;

          line-height: 1;

          background: linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.5));

          -webkit-background-clip: text; -webkit-text-fill-color: transparent;

          background-clip: text;

          animation: ld-fadein 0.8s ease both;

        }

        .ld-tagline {

          font-family: 'Barlow', sans-serif;

          font-size: 11px; font-weight: 400;

          letter-spacing: 0.32em; text-transform: uppercase;

          color: rgba(255,255,255,0.35);

          margin-top: 4px;

          animation: ld-fadein 0.8s 0.2s ease both;

        }

        @keyframes ld-fadein {

          from { opacity: 0; transform: translateY(8px); }

          to   { opacity: 1; transform: translateY(0); }

        }



        /* Progress */

        .ld-progress-wrap {

          width: 200px; margin-top: 20px;

          animation: ld-fadein 0.8s 0.4s ease both;

        }

        .ld-progress-track {

          height: 3px;

          background: rgba(255,255,255,0.07);

          border-radius: 999px;

          overflow: hidden;

          position: relative;

        }

        .ld-progress-bar {

          height: 100%;

          border-radius: 999px;

          background: linear-gradient(90deg, #ff6a00, #ee0979, #9b59b6);

          transition: width 0.08s linear;

          position: relative;

        }

        .ld-progress-bar::after {

          content: '';

          position: absolute; right: 0; top: -2px;

          width: 8px; height: 7px; border-radius: 50%;

          background: #fff;

          box-shadow: 0 0 8px #ff6a00, 0 0 16px #ff6a00;

        }

        .ld-progress-pct {

          font-family: 'Barlow', sans-serif;

          font-size: 11px; font-weight: 300;

          color: rgba(255,255,255,0.3);

          letter-spacing: 0.1em;

          text-align: right;

          margin-top: 6px;

        }



        /* Corners */

        .ld-corner {

          position: absolute;

          width: 18px; height: 18px;

        }

        .ld-c-tl { top: 20px; left: 20px; border-top: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }

        .ld-c-tr { top: 20px; right: 20px; border-top: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }

        .ld-c-bl { bottom: 20px; left: 20px; border-bottom: 2px solid rgba(255,106,0,0.35); border-left: 2px solid rgba(255,106,0,0.35); }

        .ld-c-br { bottom: 20px; right: 20px; border-bottom: 2px solid rgba(255,106,0,0.35); border-right: 2px solid rgba(255,106,0,0.35); }



        /* Status text */

        .ld-status {

          font-family: 'Barlow', sans-serif;

          font-size: 10px; font-weight: 400;

          letter-spacing: 0.22em; text-transform: uppercase;

          color: rgba(255,106,0,0.5);

          margin-top: 10px;

          animation: ld-blink 1.2s ease-in-out infinite;

        }

        @keyframes ld-blink {

          0%,100% { opacity: 0.5; }

          50%      { opacity: 1; }

        }`}</style>

      <div className={`ld-root${exiting ? " exit" : ""}`}>
        <div className="ld-grid" />
        <div className="ld-scan" />
        <div className="ld-orb1" />
        <div className="ld-orb2" />

        {/* Corner decorations */}
        <div className="ld-corner ld-c-tl" />
        <div className="ld-corner ld-c-tr" />
        <div className="ld-corner ld-c-bl" />
        <div className="ld-corner ld-c-br" />

        {/* Floating particles */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="ld-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Center piece */}
        <div className="ld-center">
          <div className="ld-rings">
            <div className="ld-r4 ld-ring" />
            <div className="ld-r3 ld-ring" />
            <div className="ld-r1 ld-ring" />
            <div className="ld-r2 ld-ring" />

            {/* Orbit dots */}
            <div className="ld-dot ld-dot-a" />
            <div className="ld-dot ld-dot-b" />
            <div className="ld-dot ld-dot-c" />

            {/* Hex core icon */}
            <div className="ld-hex">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff6a00"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            {/* Layer-by-layer print visualization */}
            <div className="ld-layers">
              {Array.from({ length: Math.min(printedLines, 12) }, (_, i) => (
                <div
                  key={i}
                  className="ld-layer"
                  style={{
                    width: `${28 + Math.sin(i * 0.8) * 12}px`,
                    animationDelay: `${i * 0.05}s`,
                    opacity: 0.5 + (i / 12) * 0.5,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="ld-brand">TESOLUCIONA3D</div>
          <div className="ld-tagline">Tecnología de Impresión 3D</div>

          {/* Progress */}
          <div className="ld-progress-wrap">
            <div className="ld-progress-track">
              <div
                className="ld-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="ld-progress-pct">{Math.round(progress)}%</div>
          </div>

          {/* Estado Dinámico */}
          <div className="ld-status">{statusText}</div>
        </div>
      </div>
    </>
  );
}
