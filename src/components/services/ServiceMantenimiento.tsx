import { ArrowRight, CheckCircle2, Wrench } from "lucide-react";

import Breadcrumbs from "../seo/Breadcrumbs";

export default function ServiceMantenimiento() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20necesito%20mantenimiento%20o%20reparaci%C3%B3n%20para%20mi%20impresora%203D%20en%20Cali.%20Este%20es%20el%20modelo%20y%20la%20falla:";

  return (
    <section className="relative w-full overflow-hidden py-16">
      <div className="relative z-10 mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <Breadcrumbs
          items={[
            { label: "Inicio", path: "/" },
            { label: "Servicios", path: "/#servicios" },
            {
              label: "Mantenimiento de impresoras 3D",
              path: "/servicios/mantenimiento",
            },
          ]}
        />

        <div className="mb-20 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              Servicio técnico especializado
            </p>

            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Mantenimiento y{" "}
              <span className="inline-block bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-400 bg-clip-text pr-2 text-transparent">
                reparación 3D
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Diagnosticamos, calibramos y reparamos impresoras 3D para
              recuperar estabilidad, precisión y confiabilidad. Atendemos en
              Cali con orientación práctica para equipos que presentan fallas,
              desgaste o pérdida de calidad.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/50 px-7 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800"
              >
                Solicitar diagnóstico <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 shadow-2xl">
            <img
              src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FzExjDBOx30i9CiTtbZop9C.Img.054620.jpg"
              alt="Mantenimiento de impresoras 3D en Cali"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Qué incluye el servicio
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Diagnóstico completo de hardware y firmware",
              "Calibración de cama, flujo y extrusión",
              "Ajuste de steps y revisión de parámetros",
              "Limpieza y mantenimiento preventivo",
              "Revisión de boquillas y sistema de extrusión",
              "Recomendaciones para mejorar estabilidad y calidad",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md"
              >
                <CheckCircle2 className="mt-1 text-emerald-400" />
                <span className="text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-3xl font-black uppercase md:text-4xl">
            Problemas que solucionamos
          </h2>

          <div className="flex flex-wrap gap-4">
            {[
              "Capas desalineadas",
              "Mala adhesión",
              "Sub-extrusión",
              "Ruidos mecánicos",
              "Fallos de nivelación",
              "Piezas deformadas",
            ].map((problem) => (
              <span
                key={problem}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold"
              >
                {problem}
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
                title: "Diagnóstico",
                desc: "Identificamos la causa raíz de la falla.",
              },
              {
                step: "02",
                title: "Corrección",
                desc: "Ajustamos, reparamos o calibramos según el caso.",
              },
              {
                step: "03",
                title: "Optimización",
                desc: "Dejamos el equipo listo para producción estable.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-md"
              >
                <p className="mb-2 text-lg font-black text-emerald-400">
                  {item.step}
                </p>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 text-center backdrop-blur-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <Wrench className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase md:text-4xl">
            ¿Tu impresora 3D no está trabajando como debería?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Escríbenos con el modelo de impresora y la falla que presenta. Te
            ayudamos a definir si necesitas calibración, mantenimiento o
            reparación.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-400 px-8 py-4 font-black text-black shadow-xl transition-transform hover:scale-105"
          >
            Pedir diagnóstico <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
