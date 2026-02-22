import React, { useEffect, useRef } from "react";

type Props = {
  className?: string;
  intensity?: number; // 0.05 - 0.25
  size?: number; // px
};

export default function InteractiveGlow({
  className = "",
  intensity = 0.14,
  size = 520,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setPos = (x: number, y: number) => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    // Posición inicial (centro)
    const rect0 = el.getBoundingClientRect();
    setPos(rect0.width / 2, rect0.height / 2);

    // Cambiamos a escuchar el evento del ratón en la VENTANA completa (window)
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;

      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const rect = ref.current!.getBoundingClientRect();
        // Calculamos la posición del ratón restando la posición de la sección
        setPos(e.clientX - rect.left, e.clientY - rect.top);
      });
    };

    // ¡Aquí está la magia! Cambiamos 'el' por 'window'
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={
        {
          ["--glow" as any]: intensity,
          ["--size" as any]: `${size}px`,
        } as React.CSSProperties
      }
    >
      {/* Glow blanco sutil */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(var(--size) circle at var(--mx) var(--my), rgba(255,255,255,var(--glow)), transparent 60%)",
          filter: "blur(18px)",
          opacity: 0.9,
          mixBlendMode: "screen",
          transform: "translateZ(0)",
        }}
      />

      {/* Glow color (rosado) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(calc(var(--size) * 0.85) circle at calc(var(--mx) + 40px) calc(var(--my) - 30px), rgba(244,63,94,0.12), transparent 62%)",
          filter: "blur(22px)",
          opacity: 0.9,
          mixBlendMode: "screen",
          transform: "translateZ(0)",
        }}
      />

      {/* Grano “fake” sin imagen externa */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
