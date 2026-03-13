import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

import Breadcrumbs from "../seo/Breadcrumbs";

export default function ServiceLaser() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20un%20servicio%20de%20corte%20y%20grabado%20l%C3%A1ser%20en%20Cali.%20Este%20es%20mi%20dise%C3%B1o:";

  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="relative z-10 mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <Breadcrumbs
          items={[
            { label: "Inicio", path: "/" },
            { label: "Servicios", path: "/#servicios" },
            { label: "Corte y grabado láser", path: "/servicios/laser" },
          ]}
        />

        <div className="mb-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
              Servicio especializado
            </p>

            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Corte y grabado{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                láser en Cali
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Desarrollamos cortes precisos y grabados de alta calidad para
              señalética, piezas decorativas, acrílicos personalizados y
              soluciones comerciales. Es un servicio pensado para proyectos
              puntuales, producción corta y trabajos con acabado limpio.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/50 px-7 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
              >
                Cotizar corte láser <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-2xl">
            <img
              src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2F52BaACqZWTHHjDRp8NCuKn.Img.054338.jpg"
              alt="Servicio de corte y grabado láser en Cali"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Aplicaciones y beneficios
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Grabado de logos y piezas corporativas",
              "Corte de piezas decorativas y estructurales",
              "Producción en pequeñas cantidades",
              "Señalética personalizada para negocios",
              "Alta precisión y repetibilidad",
              "Acabado limpio y profesional",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md"
              >
                <CheckCircle2 className="mt-1 text-sky-400" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Materiales compatibles
          </h2>

          <div className="flex flex-wrap gap-4">
            {[
              "Acrílico",
              "MDF",
              "Madera",
              "Cartón",
              "Materiales compatibles según proyecto",
            ].map((material) => (
              <span
                key={material}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold"
              >
                {material}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Nuestro proceso
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Revisión",
                desc: "Validamos diseño, material y objetivo del proyecto.",
              },
              {
                step: "02",
                title: "Producción",
                desc: "Ejecutamos el corte o grabado con parámetros optimizados.",
              },
              {
                step: "03",
                title: "Entrega",
                desc: "Te entregamos el producto listo para instalar o usar.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-md"
              >
                <p className="mb-2 text-lg font-black text-sky-400">
                  {item.step}
                </p>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10">
            <Zap className="h-6 w-6 text-sky-400" />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase md:text-4xl">
            ¿Listo para producir tu diseño?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Envíanos tu idea o archivo y te ayudamos a definir materiales,
            dimensiones y viabilidad para tu proyecto de corte o grabado láser.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-8 py-4 font-black text-black shadow-xl transition-transform hover:scale-105"
          >
            Hablar por WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
