import { ArrowRight, Boxes, Wrench, Zap } from "lucide-react";
import { Link } from "react-router-dom";

import { siteConfig } from "@/lib/siteConfig";

export default function Services() {
  const services = [
    {
      title: "Impresión 3D en Cali",
      desc: "Prototipos, repuestos, piezas personalizadas y producción corta con asesoría técnica y materiales según tu proyecto.",
      icon: Boxes,
      to: "/servicios/impresion-3d",
      cta: "Ver servicio de impresión 3D",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FwA03nd5xRmMAIOJD8SEpa5.Img.054206.jpg",
      accent: "from-amber-500/30 via-rose-500/20 to-purple-600/20",
    },
    {
      title: "Corte y grabado láser",
      desc: "Cortes limpios y grabados precisos para señalética, decoración, acrílico, MDF y piezas comerciales.",
      icon: Zap,
      to: "/servicios/laser",
      cta: "Ver corte y grabado láser",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2F52BaACqZWTHHjDRp8NCuKn.Img.054338.jpg",
      accent: "from-sky-500/25 via-indigo-500/15 to-purple-600/20",
    },
    {
      title: "Mantenimiento de impresoras 3D",
      desc: "Diagnóstico, calibración y reparación para recuperar el rendimiento de tu impresora 3D.",
      icon: Wrench,
      to: "/servicios/mantenimiento",
      cta: "Ver mantenimiento técnico",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FzExjDBOx30i9CiTtbZop9C.Img.054620.jpg",
      accent: "from-emerald-500/20 via-cyan-500/15 to-slate-500/10",
    },
  ];

  return (
    <section id="servicios" className="relative w-full overflow-hidden py-16">
      <div className="relative z-10 mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Servicios
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white md:text-5xl">
              Soluciones de fabricación digital en Colombia
            </h2>
            <p className="mt-3 text-lg text-slate-400">
              En Tesoluciona3D combinamos impresión 3D, corte láser y servicio
              técnico para resolver proyectos personalizados, prototipos y
              producción corta con enfoque comercial y local.
            </p>
          </div>

          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
          >
            Cotizar ahora <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-md"
              >
                <div className="relative h-[280px] shrink-0 overflow-hidden sm:h-[340px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />

                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-40 bg-gradient-to-tr ${service.accent} mix-blend-overlay`}
                  />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-md">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10">
                      <Icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Servicio
                    </span>
                  </div>
                </div>

                <div className="flex flex-grow flex-col bg-zinc-950/50 p-6 md:p-8">
                  <h3 className="mb-3 text-2xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-amber-400">
                    {service.title}
                  </h3>
                  <p className="mb-8 flex-grow leading-relaxed text-slate-400">
                    {service.desc}
                  </p>

                  <Link
                    to={service.to}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-white transition-all group-hover:border-white/20 group-hover:bg-white/10"
                  >
                    {service.cta}
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 transition-all duration-500 group-hover:ring-white/20" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
