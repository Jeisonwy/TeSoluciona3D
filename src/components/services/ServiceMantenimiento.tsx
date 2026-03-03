import { ArrowRight, CheckCircle2, Wrench } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ServiceMantenimiento() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20necesito%20mantenimiento%20o%20reparaci%C3%B3n%20para%20mi%20impresora%203D.%20Este%20es%20el%20modelo%20y%20la%20falla:";

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Mantenimiento y Reparación de Impresoras 3D | Tesoluciona 3D
        </title>
        <meta
          name="description"
          content="Servicio técnico especializado en mantenimiento, calibración y reparación de impresoras 3D. Diagnóstico profesional y optimización de rendimiento."
        />
        <meta
          name="keywords"
          content="mantenimiento impresora 3D, reparación impresora 3D Colombia, calibración impresora 3D, servicio técnico impresoras 3D"
        />
      </Helmet>

      <section className="relative w-full overflow-hidden py-16">
        <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold mb-3">
                Servicio Técnico Especializado
              </p>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                Mantenimiento y{" "}
                <span className="inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-400">
                  Reparación 3D
                </span>
              </h1>

              <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-xl">
                Recupera la precisión y confiabilidad de tu impresora 3D.
                Diagnóstico profesional, calibración avanzada y solución de
                fallas para que tu máquina vuelva a rendir al máximo.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 text-white px-7 py-4 rounded-2xl text-sm font-bold transition-all border border-white/10 backdrop-blur-sm shadow-lg"
                >
                  Solicitar diagnóstico <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/40 shadow-2xl">
              <img
                src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FzExjDBOx30i9CiTtbZop9C.Img.054620.jpg"
                alt="Mantenimiento impresora 3D Tesoluciona 3D"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
            </div>
          </div>

          {/* SERVICIOS INCLUIDOS */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              ¿Qué incluye el servicio?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Diagnóstico completo de hardware y firmware",
                "Calibración de cama y extrusión",
                "Ajuste de steps y flujo",
                "Limpieza y mantenimiento preventivo",
                "Revisión de boquillas y sistema de extrusión",
                "Recomendaciones técnicas para mejor rendimiento",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <CheckCircle2 className="text-emerald-400 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROBLEMAS FRECUENTES */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              Solucionamos problemas como:
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
                  className="px-6 py-3 rounded-full text-sm font-bold bg-white/5 border border-white/10"
                >
                  {problem}
                </span>
              ))}
            </div>
          </div>

          {/* PROCESO */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              Nuestro Proceso
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Diagnóstico",
                  desc: "Identificamos la causa raíz del problema.",
                },
                {
                  step: "02",
                  title: "Corrección",
                  desc: "Realizamos ajustes, reparación o calibración.",
                },
                {
                  step: "03",
                  title: "Optimización",
                  desc: "Dejamos tu equipo listo para producción estable.",
                },
              ].map((p) => (
                <div
                  key={p.step}
                  className="p-8 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <p className="text-emerald-400 font-black text-lg mb-2">
                    {p.step}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{p.title}</h3>
                  <p className="text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA FINAL */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-black italic uppercase mb-6">
              ¿Tu impresora no está funcionando como debería?
            </h3>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-cyan-500 to-slate-400 text-black font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Solicitar servicio técnico <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
