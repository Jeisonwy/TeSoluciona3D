import { ArrowRight, CheckCircle2, Boxes } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ServiceImpresion3D() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20un%20servicio%20de%20Impresión%203D.%20Tengo%20esta%20idea:";

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Impresión 3D en Colombia | Modelado y Prototipado - Tesoluciona 3D
        </title>
        <meta
          name="description"
          content="Servicio profesional de impresión 3D en Colombia. Prototipos, piezas personalizadas, repuestos y producción corta con alta precisión."
        />
        <meta
          name="keywords"
          content="impresión 3D, modelado 3D, prototipos 3D, piezas personalizadas, impresión 3D Colombia"
        />
      </Helmet>

      <section className="relative w-full overflow-hidden py-16">
        <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold mb-3">
                Servicio Especializado
              </p>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase pr-2">
                Impresión{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 inline-block pr-1">
                  3D Profesional
                </span>
              </h1>

              <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-xl">
                Convertimos tus ideas en piezas reales con precisión
                milimétrica. Desde prototipos funcionales hasta productos
                personalizados y producción en pequeña escala.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 text-white px-7 py-4 rounded-2xl text-sm font-bold transition-all border border-white/10 backdrop-blur-sm shadow-lg"
                >
                  Cotizar ahora <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/40 shadow-2xl">
              <img
                src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FwA03nd5xRmMAIOJD8SEpa5.Img.054206.jpg"
                alt="Impresión 3D Tesoluciona 3D"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
            </div>
          </div>

          {/* BENEFICIOS */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              ¿Qué ofrecemos?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Modelado 3D desde cero si no tienes archivo",
                "Optimización del modelo para mejor impresión",
                "Prototipos funcionales y decorativos",
                "Producción en pequeña escala",
                "Asesoría personalizada en materiales",
                "Alta precisión y excelente acabado",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <CheckCircle2 className="text-amber-400 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MATERIALES */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              Materiales Disponibles
            </h2>

            <div className="flex flex-wrap gap-4">
              {[
                "PLA",
                "PETG",
                "ABS",
                "TPU",
                "TPE",
                "NYLON",
                "Materiales especiales (según proyecto)",
              ].map((mat) => (
                <span
                  key={mat}
                  className={`px-6 py-3 rounded-full text-sm font-bold border ${
                    mat === "Materiales especiales (según proyecto)"
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-white/5 text-white border-white/10"
                  }`}
                >
                  {mat}
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
                  title: "Análisis",
                  desc: "Revisamos tu idea, archivo o referencia.",
                },
                {
                  step: "02",
                  title: "Producción",
                  desc: "Impresión optimizada y control de calidad.",
                },
                {
                  step: "03",
                  title: "Entrega",
                  desc: "Entrega segura y lista para usar.",
                },
              ].map((p) => (
                <div
                  key={p.step}
                  className="p-8 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <p className="text-amber-400 font-black text-lg mb-2">
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
              ¿Listo para imprimir tu idea?
            </h3>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-black font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Cotizar por WhatsApp <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
