import InteractiveGlow from "./InteractiveGlow";
import Breadcrumbs from "./seo/Breadcrumbs";
import { siteConfig } from "@/lib/siteConfig";

export default function AboutUs() {
  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 py-20 text-white">
      <div className="absolute inset-0 -z-10 hidden md:block">
        <InteractiveGlow intensity={0.12} size={800} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", path: "/" },
            { label: "Nosotros", path: "/nosotros" },
          ]}
        />

        <div className="mb-16 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
            Nosotros
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Tesoluciona3D: impresión 3D, prototipado y soluciones personalizadas
            en Cali
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            Ayudamos a empresas, emprendedores, estudiantes y clientes
            particulares a convertir ideas complejas en piezas útiles,
            prototipos funcionales y productos personalizados. Trabajamos desde
            Cali, Valle del Cauca, con enfoque técnico, tiempos de respuesta
            ágiles y una comunicación directa para que cada proyecto avance con
            claridad.
          </p>
        </div>

        <div className="mb-20 grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md transition hover:border-emerald-500/50">
            <h2 className="mb-4 text-2xl font-semibold text-emerald-400">
              Qué hacemos
            </h2>
            <p className="leading-relaxed text-zinc-300">
              En Tesoluciona3D desarrollamos proyectos de impresión 3D,
              fabricación de piezas a la medida, prototipado y soporte técnico.
              Nuestro trabajo no se limita a imprimir: también revisamos
              archivos, proponemos mejoras, elegimos materiales adecuados y
              acompañamos cada etapa para que el resultado sea viable y útil.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md transition hover:border-cyan-500/50">
            <h2 className="mb-4 text-2xl font-semibold text-cyan-400">
              A quién ayudamos
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Atendemos proyectos para validación de diseño, repuestos
              personalizados, maquetas, piezas funcionales, accesorios, lotes
              pequeños y mantenimiento de impresoras 3D. Nuestra propuesta está
              pensada para clientes que buscan una solución rápida, clara y
              cercana en Cali y Valle del Cauca.
            </p>
          </div>
        </div>

        <div className="mb-20 grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md transition hover:border-emerald-500/50">
            <h2 className="mb-4 text-xl font-semibold text-cyan-400">Misión</h2>
            <p className="leading-relaxed text-zinc-300">
              Ofrecer soluciones de impresión 3D y fabricación digital que
              permitan a nuestros clientes resolver necesidades reales con
              calidad, precisión y acompañamiento técnico.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur-md transition hover:border-cyan-500/50">
            <h2 className="mb-4 text-xl font-semibold text-emerald-400">
              Visión
            </h2>
            <p className="leading-relaxed text-zinc-300">
              Consolidarnos como una empresa referente en impresión 3D,
              reconocida por su capacidad de respuesta, criterio técnico y
              resultados confiables para proyectos personalizados.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="mb-10 text-center text-2xl font-semibold text-white">
            Nuestros valores
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              "Precisión técnica",
              "Orientación a la solución",
              "Comunicación clara",
            ].map((value) => (
              <div
                key={value}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center transition hover:scale-[1.03] hover:border-emerald-500/40"
              >
                <p className="font-medium tracking-wide text-zinc-200">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-cyan-400">
            Dirección y atención
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-zinc-300">
            Operamos con atención cercana para proyectos locales, cotizaciones
            rápidas y soporte por WhatsApp, correo y teléfono. Si necesitas
            validar una pieza, un prototipo o una reparación de impresora 3D,
            podemos ayudarte a definir el siguiente paso de forma práctica.
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-12 text-center">
          <h2 className="mb-6 text-xl font-semibold text-white">
            Información de contacto
          </h2>

          <address className="space-y-3 not-italic text-zinc-300">
            <p>{siteConfig.address}</p>
            <p>
              {siteConfig.postalCode} {siteConfig.city}, {siteConfig.region} -
              Colombia
            </p>
            <p>
              <a href={siteConfig.phoneHref} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a href={siteConfig.emailHref} className="hover:text-white">
                {siteConfig.email}
              </a>
            </p>
          </address>
        </div>
      </div>
    </section>
  );
}
