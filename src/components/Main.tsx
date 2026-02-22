import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Cpu,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Main() {
  const images = useMemo(
    () => [
      "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FXXII3eLMeFHVl7Aqy6FCOy.Img.021225.jpg",
      "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FzPM5WTIe457VGhs9U6HYaP.Img.034551.jpg",
      "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2F390D95PPbOxR7JLbfTiEk9.Img.041458.jpg",
      "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FZWBVYG879O9lPw1HoeoWOF.Img.041615.png",
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  // Auto-play
  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % images.length);
    }, 3500);
    return () => clearInterval(id);
  }, [images.length]);

  const go = (nextDir: 1 | -1) => {
    setDir(nextDir);
    setIndex((i) => {
      const next = i + nextDir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  // Variants para slide + fade
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 24 : -24, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -24 : 24, scale: 0.98 }),
  };

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background Elements (blobs) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-rose-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Cpu className="w-3 h-3" />
              Tecnología de Impresión 3D de vanguardia
            </div>

            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[1.1] mb-4 text-white uppercase">
              TESOLUCIONA3D
            </h1>

            <h2 className="text-2xl md:text-3xl font-medium text-slate-200 mb-8">
              <span className="text-amber-500">{">>"}</span> Damos forma a tus
              ideas con tecnologia 3D
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              Transformamos tus ideas más complejas en piezas reales. Desde
              prototipos industriales hasta diseños personalizados, llevamos la
              fabricación digital a tu alcance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                className="group bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25"
              >
                Cotizar Proyecto
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                className="bg-zinc-900/50 hover:bg-zinc-800 text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                Ver Catálogo
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8 border-t border-white/5 pt-8">
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-slate-500">Proyectos</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-sm text-slate-500">Respuesta</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm text-slate-500">Satisfacción</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 p-2">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="relative w-full aspect-square">
                  <AnimatePresence initial={false} custom={dir}>
                    <motion.img
                      key={index}
                      src={images[index]}
                      alt="Impresión 3D"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-lighten"
                      custom={dir}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      draggable={false}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md"
                      aria-label="Anterior"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/10 backdrop-blur-md"
                      aria-label="Siguiente"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Bullets */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setDir(i > index ? 1 : -1);
                          setIndex(i);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          i === index
                            ? "w-6 bg-white/80"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Ir a imagen ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 z-20 bg-zinc-900/90 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/30">
                  <Box className="text-rose-400 w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    Calidad Industrial
                  </div>
                  <div className="text-xs text-slate-400">
                    Precisión de micras
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <div className="pb-40"></div>
    </section>
  );
}
