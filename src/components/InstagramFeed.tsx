import { useEffect, useRef, useState } from "react";

export default function InstagramFeedIframe() {
  const iframeUrl = "https://emb.fouita.com/widget/0x3edf73/ftaqof99o";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16">
      <div className="relative z-10 mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <h2 className="text-center text-2xl font-black uppercase tracking-tight text-white sm:text-3xl md:text-5xl">
          Síguenos en{" "}
          <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text pr-2 text-transparent">
            Instagram
          </span>
        </h2>

        <p className="mx-auto mt-3 mb-8 max-w-2xl text-center text-sm text-slate-400 sm:text-base md:mb-12 md:text-lg">
          Cargamos este bloque solo cuando entra en pantalla para reducir el
          peso inicial de la página principal.
        </p>

        <div
          ref={containerRef}
          className="w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 shadow-2xl"
        >
          {shouldLoad ? (
            <iframe
              src={iframeUrl}
              title="Instagram feed"
              className="min-h-[400px] w-full bg-zinc-950"
              loading="lazy"
            />
          ) : (
            <div className="grid min-h-[400px] place-items-center bg-zinc-950 text-sm text-slate-500">
              El feed se cargará cuando llegues a esta sección.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
