import { ArrowRight, Boxes, CheckCircle2 } from "lucide-react";

import Breadcrumbs from "../seo/Breadcrumbs";

export default function ServiceImpresion3D() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20un%20servicio%20de%20impresi%C3%B3n%203D%20en%20Cali.%20Tengo%20esta%20idea:";

  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="relative z-10 mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <Breadcrumbs
          items={[
            { label: "Inicio", path: "/" },
            { label: "Servicios", path: "/#servicios" },
            { label: "Impresión 3D", path: "/servicios/impresion-3d" },
          ]}
        />

        <div className="mb-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              Servicio especializado
            </p>

            <h1 className="pr-2 text-4xl font-black uppercase tracking-tight md:text-6xl">
              Impresión{" "}
              <span className="inline-block bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 bg-clip-text pr-1 text-transparent">
                3D en Cali
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Fabricamos prototipos, piezas personalizadas, repuestos y
              soluciones a medida con impresión 3D para clientes en Cali, Valle
              del Cauca. Revisamos archivos, optimizamos geometrías y te
              acompañamos para elegir el material y acabado adecuados.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/50 px-7 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
              >
                Cotizar impresión 3D <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-2xl">
            <img
              src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FwA03nd5xRmMAIOJD8SEpa5.Img.054206.jpg"
              alt="Servicio de impresión 3D en Cali"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Qué incluye nuestro servicio de impresión 3D
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Modelado 3D desde cero si aún no tienes archivo",
              "Optimización del modelo para reducir fallas de impresión",
              "Prototipos funcionales y piezas personalizadas",
              "Producción en pequeña escala para validación y ventas",
              "Asesoría en materiales según uso, resistencia y acabado",
              "Entrega con acompañamiento y recomendaciones técnicas",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md"
              >
                <CheckCircle2 className="mt-1 text-amber-400" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Materiales disponibles
          </h2>

          <div className="flex flex-wrap gap-4">
            {[
              "PLA",
              "PETG",
              "ABS",
              "TPU",
              "TPE",
              "NYLON",
              "Materiales especiales según proyecto",
            ].map((material) => (
              <span
                key={material}
                className={`rounded-full px-6 py-3 text-sm font-bold ${
                  material === "Materiales especiales según proyecto"
                    ? "border border-red-500/30 bg-red-500/10 text-red-400"
                    : "border border-white/10 bg-white/5 text-white"
                }`}
              >
                {material}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Cómo trabajamos tu proyecto
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Análisis",
                desc: "Revisamos tu archivo, referencia o necesidad funcional.",
              },
              {
                step: "02",
                title: "Producción",
                desc: "Imprimimos con parámetros optimizados y control de calidad.",
              },
              {
                step: "03",
                title: "Entrega",
                desc: "Entregamos la pieza lista para validar, usar o escalar.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-md"
              >
                <p className="mb-2 text-lg font-black text-amber-400">
                  {item.step}
                </p>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
            <Boxes className="h-6 w-6 text-amber-400" />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase md:text-4xl">
            ¿Listo para cotizar tu pieza o prototipo?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Escríbenos por WhatsApp y cuéntanos qué necesitas fabricar. Si ya
            tienes archivo o referencia, revisamos la viabilidad y te orientamos
            con el mejor material para tu proyecto.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 px-8 py-4 font-black text-black shadow-xl transition-transform hover:scale-105"
          >
            Hablar por WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
