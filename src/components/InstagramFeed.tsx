import React from "react";

export default function InstagramFeedIframe() {
  const iframeUrl = "https://rss.app/embed/v1/carousel/C9P3bUUHJX45dvB2";

  return (
    // 1. relative y overflow-hidden son CLAVES para que el glow no se salga de esta sección
    <section className="relative w-full overflow-hidden">
      {/* 2. El Glow Interactivo en el fondo (-z-10) */}

      {/* 3. El contenido por encima del glow (z-10) */}
      <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título unificado con el estilo de la marca */}
        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-center text-white uppercase">
          Síguenos en{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 pr-2">
            Instagram
          </span>
        </h3>

        <p className="text-slate-400 mt-3 mb-12 text-center text-lg">
          Últimas publicaciones y proyectos reales
        </p>

        {/* Contenedor del Iframe con efecto "Glassmorphism" */}
        <div className="w-full bg-zinc-900/40 shadow-2xl">
          <iframe
            src={iframeUrl}
            title="Instagram feed"
            className="w-full h-[10px] md:h-[500px] rounded-xl bg-zinc-950"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
