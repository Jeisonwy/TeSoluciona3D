import { useState, useEffect, useRef } from "react";
import { Layers } from "lucide-react";

const WORDS = ["INNOVACIÓN", "PRECISIÓN", "VELOCIDAD", "CALIDAD"];

export default function AnimatedMiddleBanner() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const bannerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };
    const el = bannerRef.current;
    el?.addEventListener("mousemove", handleMouse);
    return () => el?.removeEventListener("mousemove", handleMouse);
  }, []);

  const dx = (mousePos.x - 50) / 50;
  const dy = (mousePos.y - 50) / 50;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');

        .mid-banner {
          position: relative;
          min-height: 480px; 
          overflow: hidden;
          font-family: 'Barlow', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          border-radius: 24px;
        }

        /* --- ORBITAL DESIGN --- */
        .mid-orbital-system {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 5;
          width: 500px;
          height: 500px;
          pointer-events: none;
          transform: translate(calc(-50% + ${dx * -15}px), calc(-50% + ${dy * -15}px));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Cuadrícula sutil de fondo del sistema */
        .mid-orbital-grid {
          position: absolute;
          inset: -200px;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: center;
          opacity: 0.5;
          z-index: 0;
        }

        /* LÍNEA ESCÁNER ESTILO IMPRESORA 3D */
        .mid-orbital-line {
          position: absolute;
          width: 200vw; 
          height: 2px;
          /* Hacemos que se difumine en las orillas para que parezca un láser */
          background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.8), transparent);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.5); /* Resplandor */
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          /* Animación que sube y baja */
          animation: mid-printer-scan 6s ease-in-out infinite;
        }

        @keyframes mid-printer-scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 110%; opacity: 1; }
          90% { opacity: 1; }
          100% { top: -10%; opacity: 0; }
        }

        /* Icono central (Layers) */
        .mid-center-icon-box {
          position: absolute;
          width: 64px;
          height: 64px;
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
        }

        /* Órbita Circular Principal (Sólida) */
        .mid-orbit-circle {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(245, 158, 11, 0.4);
          z-index: 2;
        }

        /* Órbita Elíptica Horizontal (Punteada) */
        .mid-orbit-ellipse-h {
          position: absolute;
          width: 480px;
          height: 220px;
          border-radius: 50%;
          border: 1px dashed rgba(225, 29, 72, 0.4); /* Rose */
          z-index: 2;
        }

        /* Órbita Circular Exterior Grande (Muy sutil) */
        .mid-orbit-circle-outer {
          position: absolute;
          width: 460px;
          height: 460px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1;
        }

        /* Contenedores giratorios para los planetas/puntos */
        .mid-spin-circle {
          position: absolute;
          width: 320px;
          height: 320px;
          animation: mid-spin 12s linear infinite;
          z-index: 3;
        }
        
        .mid-spin-ellipse {
          position: absolute;
          width: 480px;
          height: 220px;
          animation: mid-spin-reverse 18s linear infinite reverse;
          z-index: 3;
        }

        @keyframes mid-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mid-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Puntos/Planetas */
        .mid-dot {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        
        /* Puntos en órbita circular (Amber) */
        .mid-dot-c1 { top: 0%; left: 50%; width: 8px; height: 8px; background: #f59e0b; box-shadow: 0 0 12px #f59e0b; }
        .mid-dot-c2 { top: 100%; left: 50%; width: 8px; height: 8px; background: #f59e0b; box-shadow: 0 0 12px #f59e0b; }
        
        /* Puntos en órbita elíptica (Rosa/Magenta) */
        .mid-dot-e1 { top: 50%; left: 0%; width: 8px; height: 8px; background: #e11d48; box-shadow: 0 0 12px #e11d48; }
        .mid-dot-e2 { top: 50%; left: 100%; width: 8px; height: 8px; background: #e11d48; box-shadow: 0 0 12px #e11d48; }

        /* --- CONTENIDO --- */
        .mid-content {
          position: relative;
          z-index: 20; 
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 800px;
          background: radial-gradient(circle at center, rgba(9, 9, 11, 0.6) 0%, transparent 70%);
        }

        .mid-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 6vw, 84px);
          line-height: 1;
          color: #fff;
          margin: 0;
          letter-spacing: 2px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }
        
        .mid-title-line {
          display: inline-block;
          margin-right: 12px;
        }
        
        .mid-title-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.6);
        }

        .mid-word-wrap {
          display: block;
          height: clamp(52px, 6vw, 88px);
          overflow: hidden;
          margin-top: 8px;
        }
        
        .mid-word {
          display: block;
          background: linear-gradient(135deg, #f59e0b, #e11d48, #9333ea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease;
          filter: drop-shadow(0 4px 10px rgba(225, 29, 72, 0.5));
        }
        .mid-word.hidden { transform: translateY(100%); opacity: 0; }
        .mid-word.shown { transform: translateY(0); opacity: 1; }

        .mid-subtitle {
          font-size: 18px;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          line-height: 1.6;
          max-width: 600px;
          margin: 24px auto 0;
          text-shadow: 0 2px 10px rgba(0,0,0,1);
        }
      `}</style>

      <section
        className="relative w-full overflow-hidden py-16 mid-banner"
        ref={bannerRef}
      >
        <div className="relative z-10 w-full max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[480px]">
          {/* Sistema Orbital */}
          <div className="mid-orbital-system">
            <div className="mid-orbital-grid" />

            {/* AQUÍ ESTÁ LA MAGIA DEL ESCÁNER */}
            <div className="mid-orbital-line" />

            <div className="mid-orbit-circle" />
            <div className="mid-orbit-ellipse-h" />
            <div className="mid-orbit-circle-outer" />

            <div className="mid-center-icon-box">
              <Layers className="text-amber-500 w-8 h-8" />
            </div>

            <div className="mid-spin-circle">
              <div className="mid-dot mid-dot-c1" />
              <div className="mid-dot mid-dot-c2" />
            </div>

            <div className="mid-spin-ellipse">
              <div className="mid-dot mid-dot-e1" />
              <div className="mid-dot mid-dot-e2" />
            </div>
          </div>

          {/* Contenido Central */}
          <div className="mid-content">
            <h2 className="mid-title">
              <span className="mid-title-line">TU IDEA,</span>
              <span className="mid-title-line mid-title-outline">HECHA</span>
              <span className="mid-word-wrap">
                <span className={`mid-word ${visible ? "shown" : "hidden"}`}>
                  {WORDS[wordIndex]}
                </span>
              </span>
            </h2>

            <p className="mid-subtitle">
              No te conformes con imaginarlo. Llevamos la fabricación digital a
              tu alcance con precisión de micras y calidad industrial.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
