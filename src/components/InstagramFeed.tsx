export default function InstagramFeedIframe() {
  const iframeUrl = "https://rss.app/embed/v1/carousel/C9P3bUUHJX45dvB2";

  return (
    <section className="relative w-full overflow-hidden py-12 md:py-16">
      <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-black italic tracking-tighter leading-tight text-center text-white uppercase">
          Síguenos en{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 pr-2">
            Instagram
          </span>
        </h3>

        <p className="text-slate-400 mt-3 mb-8 md:mb-12 text-center text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          Últimas publicaciones y proyectos reales
        </p>

        <div className="w-full bg-zinc-900/40 shadow-2xl rounded-xl overflow-hidden border border-white/10">
          <iframe
            src={iframeUrl}
            title="Instagram feed"
            className="w-full h-[460px] sm:h-[520px] md:h-[600px] bg-zinc-950"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
