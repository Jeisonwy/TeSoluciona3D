import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function ServiceLaser() {
  const whatsappUrl =
    "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20un%20servicio%20de%20Corte%20y%20Grabado%20L%C3%A1ser.%20Este%20es%20mi%20dise%C3%B1o/material:";

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          Corte y Grabado Láser en Colombia | Acrílico, MDF y Más - Tesoluciona
          3D
        </title>
        <meta
          name="description"
          content="Servicio profesional de corte y grabado láser en acrílico, MDF y madera. Señalética, decoración, personalización y producción corta."
        />
        <meta
          name="keywords"
          content="corte láser Colombia, grabado láser acrílico, corte MDF, señalética personalizada, grabado personalizado"
        />
      </Helmet>

      <section className="relative w-full overflow-hidden py-16">
        <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* HERO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sky-400 font-semibold mb-3">
                Servicio Especializado
              </p>

              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
                Corte y Grabado{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600">
                  Láser Profesional
                </span>
              </h1>

              <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-xl">
                Cortes precisos y grabados de alta calidad para proyectos
                decorativos, comerciales e industriales. Ideal para señalética,
                acrílicos personalizados, cajas, placas y productos únicos.
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
                src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2F52BaACqZWTHHjDRp8NCuKn.Img.054338.jpg"
                alt="Corte y grabado láser Tesoluciona 3D"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />
            </div>
          </div>

          {/* BENEFICIOS */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              Aplicaciones y Beneficios
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Grabado de logos y marcas corporativas",
                "Corte de piezas decorativas y estructurales",
                "Producción en pequeñas cantidades",
                "Señalética personalizada",
                "Alta precisión y repetibilidad",
                "Acabado limpio y profesional",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <CheckCircle2 className="text-sky-400 mt-1" />
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MATERIALES */}
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase mb-10">
              Materiales Compatibles
            </h2>

            <div className="flex flex-wrap gap-4">
              {[
                "Acrílico",
                "MDF",
                "Madera",
                "Cartón",
                "Materiales compatibles según proyecto",
              ].map((mat) => (
                <span
                  key={mat}
                  className="px-6 py-3 rounded-full text-sm font-bold bg-white/5 border border-white/10"
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
                  title: "Revisión",
                  desc: "Validamos diseño y material para mejor resultado.",
                },
                {
                  step: "02",
                  title: "Producción",
                  desc: "Corte o grabado con parámetros optimizados.",
                },
                {
                  step: "03",
                  title: "Entrega",
                  desc: "Producto terminado listo para instalación o uso.",
                },
              ].map((p) => (
                <div
                  key={p.step}
                  className="p-8 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md"
                >
                  <p className="text-sky-400 font-black text-lg mb-2">
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
              ¿Listo para producir tu diseño?
            </h3>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-black font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
            >
              Cotizar por WhatsApp <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
