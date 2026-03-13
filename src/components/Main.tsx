import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Cpu,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import LocalFaq from "./faq/LocalFaq";
import { siteConfig } from "@/lib/siteConfig";

const ENDPOINT = "https://www.tesoluciona3d.com/api/get_landing_images.php";
type LandingImageItem = {
  id: number;
  image_url: string;
  url?: string;
  created_at: string;
};

type LandingImagesResponse = {
  success: boolean;
  message: string;
  data: LandingImageItem[];
};
const useCases = [
  "Repuestos impresos en 3D",
  "Prototipos funcionales",
  "Piezas decorativas personalizadas",
  "Maquetas y proyectos académicos",
  "Producción corta para validación",
  "Soluciones a medida para empresas",
];

export default function Main() {
  const navigate = useNavigate();
  // Iniciamos el estado sin ninguna imagen
  const [images, setImages] = useState<LandingImageItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  function normalizeRedirectUrl(url?: string) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  }

  const handleHeroImageClick = () => {
    const current = images[index];
    if (!current?.url) return;

    if (
      current.url.startsWith("http://") ||
      current.url.startsWith("https://")
    ) {
      window.open(current.url, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(current.url);
  };
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(ENDPOINT);
        const data: LandingImagesResponse = await response.json();

        const nextImages = Array.isArray(data?.data)
          ? data.data
              .filter((item) => item?.image_url)
              .map((item) => ({
                ...item,
                image_url:
                  item.image_url.startsWith("http://") ||
                  item.image_url.startsWith("https://")
                    ? item.image_url
                    : `https://www.tesoluciona3d.com${item.image_url.startsWith("/") ? item.image_url : `/${item.image_url}`}`,
                url: normalizeRedirectUrl(item.url),
              }))
          : [];

        setImages(nextImages);
      } catch {
        // Falla silenciosa si la galería no está disponible
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    if (index >= images.length && images.length > 0) {
      setIndex(0);
    }
  }, [images, index]);

  useEffect(() => {
    if (images.length <= 1) return;

    const id = setInterval(() => {
      setDir(1);
      setIndex((current) => (current + 1) % images.length);
    }, 3500);

    return () => clearInterval(id);
  }, [images.length]);

  const go = (nextDir: 1 | -1) => {
    if (images.length === 0) return;

    setDir(nextDir);
    setIndex((current) => {
      const next = current + nextDir;

      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;

      return next;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 24 : -24,
      scale: 0.98,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -24 : 24,
      scale: 0.98,
    }),
  };

  return (
    <>
      <style>{`
        .btn-smooth-gradient {
          position: relative;
          overflow: hidden;
          z-index: 1;
          background-color: transparent;
        }

        .btn-smooth-gradient::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            to right,
            #f59e0b 0%,
            #e11d48 16.6%,
            #9333ea 33.3%,
            #f59e0b 50%,
            #e11d48 66.6%,
            #9333ea 83.3%,
            #f59e0b 100%
          );
          z-index: -1;
          animation: smooth-slide 4s linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        @keyframes smooth-slide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 -z-10 overflow-hidden">
          <div className="absolute left-1/4 top-10 h-[400px] w-[400px] rounded-full bg-amber-500/20 blur-[120px]" />
          <div className="absolute left-1/2 top-20 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-rose-600/20 blur-[120px]" />
          <div className="absolute right-1/4 top-10 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 sm:mb-6 sm:text-xs">
                <Cpu className="h-3 w-3" />
                Servicio de impresión 3D
              </div>

              <h1
                className="mb-4 break-words font-brand uppercase leading-[1.02] tracking-[0.03em] text-white"
                style={{
                  fontFamily: '"FatalFighter", system-ui, sans-serif',
                  fontSize: "clamp(2rem, 7vw, 5.1rem)",
                }}
              >
                Tesoluciona3D
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:mb-10 sm:text-lg">
                Ayudamos a convertir ideas, referencias y archivos en piezas
                reales con impresión 3D, prototipado y fabricación digital.
                Trabajamos con respuesta rápida, materiales versátiles y
                acompañamiento técnico para proyectos funcionales, comerciales y
                personalizados.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  aria-label="Cotizar impresión 3D por WhatsApp"
                  className="btn-smooth-gradient group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-bold text-white shadow-[0_0_20px_rgba(225,29,72,0.8)] transition-all hover:opacity-90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                  onClick={() => window.open(siteConfig.whatsappHref, "_blank")}
                >
                  Cotizar impresión 3D
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  aria-label="Ver catálogo de productos"
                  onClick={() => navigate("/products")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-3.5 text-base font-bold text-white transition-all hover:border-white/20 hover:bg-zinc-800 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
                >
                  Ver catálogo
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-10 grid gap-4 border-t border-white/5 pt-6 sm:mt-12 sm:grid-cols-3 sm:gap-6 sm:pt-8">
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    500+
                  </div>
                  <div className="text-xs text-slate-500 sm:text-sm">
                    Proyectos atendidos
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    24h
                  </div>
                  <div className="text-xs text-slate-500 sm:text-sm">
                    Tiempo de respuesta
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    Colombia
                  </div>
                  <div className="text-xs text-slate-500 sm:text-sm">
                    Local y regional
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARRUSEL DE IMÁGENES */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 p-2 shadow-2xl">
                <div
                  className={`relative overflow-hidden rounded-2xl ${
                    images[index]?.url ? "cursor-pointer" : ""
                  }`}
                  onClick={handleHeroImageClick}
                >
                  <div className="relative flex aspect-square w-full items-center justify-center bg-zinc-900">
                    {/* Render condicional: muestra imágenes si hay, si no, un placeholder animado */}
                    {images.length > 0 ? (
                      <AnimatePresence initial={false} custom={dir}>
                        <motion.img
                          key={images[index]?.id ?? index}
                          src={images[index]?.image_url}
                          alt="Impresión 3D de alta calidad"
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-lighten"
                          custom={dir}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          draggable={false}
                          loading="eager"
                          fetchPriority="high"
                          decoding="async"
                        />
                      </AnimatePresence>
                    ) : (
                      <div className="absolute inset-0 h-full w-full bg-zinc-800/50 animate-pulse" />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  </div>

                  {images.length > 1 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => go(-1)}
                        className="absolute left-2 top-1/2 rounded-full border border-white/10 bg-black/40 p-1.5 text-white backdrop-blur-md hover:bg-black/60 sm:left-3 sm:p-2"
                        aria-label="Imagen anterior"
                      >
                        <ChevronLeft
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            go(-1);
                          }}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => go(1)}
                        className="absolute right-2 top-1/2 rounded-full border border-white/10 bg-black/40 p-1.5 text-white backdrop-blur-md hover:bg-black/60 sm:right-3 sm:p-2"
                        aria-label="Imagen siguiente"
                      >
                        <ChevronRight
                          size={18}
                          onClick={(e) => {
                            e.stopPropagation();
                            go(1);
                          }}
                        />
                      </button>
                    </>
                  ) : null}

                  {images.length > 1 ? (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-4">
                      {images.map((_, imageIndex) => (
                        <button
                          key={imageIndex}
                          type="button"
                          onClick={() => {
                            setDir(imageIndex > index ? 1 : -1);
                            setIndex(imageIndex);
                          }}
                          className={`h-2 rounded-full transition-all ${
                            imageIndex === index
                              ? "w-6 bg-white/80"
                              : "w-2 bg-white/30 hover:bg-white/50"
                          }`}
                          aria-label={`Ir a la imagen ${imageIndex + 1}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -left-6 z-20 hidden rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/20">
                    <Box className="h-6 w-6 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      Calidad industrial
                    </div>
                    <div className="text-xs text-slate-400">
                      Precisión para piezas y prototipos
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE INFORMACIÓN Y SERVICIOS --- */}
      <section
        className="relative w-full py-16"
        aria-labelledby="local-seo-heading"
      >
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex h-full flex-col justify-center rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8 lg:p-12">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
                  Impresión 3D
                </p>
                <h2
                  id="local-seo-heading"
                  className="mb-6 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
                >
                  Servicio local para proyectos reales
                </h2>

                <div className="space-y-5">
                  <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                    Atendemos con un enfoque práctico para clientes que
                    necesitan piezas funcionales, prototipos, repuestos
                    personalizados y productos con excelente presentación. Si ya
                    tienes un archivo STL u OBJ, podemos revisar rápidamente la
                    viabilidad del proyecto, recomendar materiales y estimar
                    tiempos de producción. Si todavía no tienes el modelo,
                    también te ayudamos a estructurar la idea y llevarla a un
                    formato listo para fabricar.
                  </p>
                  <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                    Nuestro servicio está pensado para empresas, estudiantes,
                    emprendedores y clientes particulares que necesitan una
                    respuesta rápida y una comunicación clara. Trabajamos con
                    materiales como PLA, PETG, ABS y TPU según la resistencia,
                    acabado y uso final que requiera la pieza. Además de
                    fabricar, ayudamos a optimizar geometrías y elegir la mejor
                    estrategia.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  Casos de uso más comunes
                </h2>
                <div className="mt-6 grid gap-3">
                  {useCases.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-sm text-slate-300 sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  ¿Por qué elegirnos?
                </h2>
                <div className="mt-5 space-y-4 text-sm text-slate-300 sm:text-base">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      Respuesta rápida para cotizaciones y validación de
                      archivos.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      Asesoría en materiales, acabados y factibilidad técnica.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                      Operación directa con envíos seguros y a tiempo.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.open(siteConfig.whatsappHref, "_blank")}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-colors hover:border-amber-400/30 hover:bg-white/10 sm:w-auto"
                >
                  Hablar por WhatsApp
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NUEVA SECCIÓN DE CONTACTO AL FINAL --- */}
      <section className="relative w-full pb-16 pt-8">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 sm:p-12 text-center">
            <h2 className="mb-8 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Ponte en contacto
            </h2>
            <address className="mx-auto grid max-w-4xl gap-4 not-italic text-sm text-slate-300 sm:grid-cols-3">
              <a
                href={siteConfig.phoneHref}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-amber-400/30 hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <Phone className="h-5 w-5 text-amber-400" />
                </div>
                <span className="font-medium">{siteConfig.phone}</span>
              </a>

              <a
                href={siteConfig.emailHref}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-amber-400/30 hover:text-white"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <Mail className="h-5 w-5 text-amber-400" />
                </div>
                <span className="font-medium">{siteConfig.email}</span>
              </a>

              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                  <MapPin className="h-5 w-5 text-amber-400" />
                </div>
                <span className="text-center font-medium">
                  {siteConfig.city}, {siteConfig.region} <br />
                  Colombia
                </span>
              </div>
            </address>
          </div>
        </div>
      </section>

      <LocalFaq />
    </>
  );
}
