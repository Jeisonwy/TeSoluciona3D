import { ArrowRight, Wrench, Zap, Boxes } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      title: "Modelado e Impresión 3D",
      desc: "Prototipos, piezas personalizadas y producción corta con alta precisión.",
      icon: Boxes,
      to: "/servicios/impresion-3d",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FwA03nd5xRmMAIOJD8SEpa5.Img.054206.jpg",
      accent: "from-amber-500/30 via-rose-500/20 to-purple-600/20",
    },
    {
      title: "Corte y grabado láser",
      desc: "Cortes limpios y grabados premium en acrílico, madera y más.",
      icon: Zap,
      to: "/servicios/laser",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2F52BaACqZWTHHjDRp8NCuKn.Img.054338.jpg",
      accent: "from-sky-500/25 via-indigo-500/15 to-purple-600/20",
    },
    {
      title: "Mantenimiento de impresoras",
      desc: "Diagnóstico, calibración y repuestos para dejar tu máquina como nueva.",
      icon: Wrench,
      to: "/servicios/mantenimiento",
      image:
        "https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FzExjDBOx30i9CiTtbZop9C.Img.054620.jpg",
      accent: "from-emerald-500/20 via-cyan-500/15 to-slate-500/10",
    },
  ];

  return (
    <section id="servicios" className="relative w-full overflow-hidden py-16">
      <div className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold mb-2">
              Servicios
            </p>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
              Fabricación digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 pr-2">
                a tu alcance
              </span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl text-lg">
              Tres líneas principales para convertir ideas en piezas reales:
              impresión 3D, láser y mantenimiento técnico.
            </p>
          </div>

          <a
            href="http://wa.me/573177248656"
            className="inline-flex items-center gap-2 bg-zinc-900/50 hover:bg-zinc-800 text-white px-6 py-3 rounded-full text-sm font-bold transition-all border border-white/10 backdrop-blur-sm shadow-lg"
          >
            Cotizar ahora <ArrowRight size={16} />
          </a>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md shadow-2xl flex flex-col h-full"
              >
                <div className="relative h-[280px] sm:h-[340px] overflow-hidden shrink-0">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover block will-change-transform transform-gpu transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-zinc-950/60" />

                  <div
                    className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-tr ${s.accent} mix-blend-overlay`}
                  />

                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                    <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <Icon className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Servicio
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow bg-zinc-950/50">
                  <h3 className="text-2xl font-black italic tracking-tight text-white uppercase mb-3 group-hover:text-amber-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                    {s.desc}
                  </p>

                  <Link
                    to={s.to}
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full rounded-xl px-5 py-4 font-bold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all group-hover:border-white/20"
                  >
                    Saber más{" "}
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5 group-hover:ring-white/20 transition-all duration-500" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
