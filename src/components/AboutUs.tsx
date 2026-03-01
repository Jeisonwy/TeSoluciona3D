import React from "react";
import InteractiveGlow from "./InteractiveGlow";

export default function AboutUs() {
  return (
    <section className="relative w-full bg-zinc-950 text-white py-20 overflow-hidden">
      {/* Glow de fondo */}
      <div className="hidden md:block absolute inset-0 -z-10">
        <InteractiveGlow intensity={0.12} size={800} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* HERO */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            NOSOTROS
          </h2>
          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-lg">
            Transformamos ideas complejas en realidades tangibles mediante
            tecnología 3D de alta precisión.
          </p>
        </div>

        {/* ACERCA DE */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-emerald-400">
            Acerca de Tesoluciona3D
          </h3>
          <p className="text-zinc-300 leading-relaxed">
            En Tesoluciona3D somos especialistas en transformar ideas complejas
            en realidades tangibles. Utilizamos tecnología de impresión 3D de
            alta precisión para ofrecer soluciones rápidas y eficientes en
            prototipado, diseño y fabricación de piezas a la medida.
          </p>
        </div>

        {/* MISION Y VISION */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <div className="bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Misión</h3>
            <p className="text-zinc-300 leading-relaxed">
              Ofrecer soluciones innovadoras mediante impresión 3D
              personalizada, para empresas, estudiantes y creativos.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-md p-8 rounded-2xl border border-zinc-800 hover:border-cyan-500/50 transition">
            <h3 className="text-xl font-semibold text-emerald-400 mb-4">
              Visión
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              Ser referentes en tecnología 3D en la región, impulsando la
              creatividad y la fabricación digital.
            </p>
          </div>
        </div>

        {/* VALORES */}
        <div className="mb-20">
          <h3 className="text-center text-2xl font-semibold mb-10 text-white">
            Nuestros Valores
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Precisión Técnica",
              "Orientación a la Solución",
              "Innovación Continua",
            ].map((valor, index) => (
              <div
                key={index}
                className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 text-center hover:border-emerald-500/40 transition hover:scale-[1.03]"
              >
                <p className="text-zinc-200 font-medium tracking-wide">
                  {valor}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CEO */}
        <div className="text-center mb-20">
          <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
            CEO & Fundador
          </h3>
          <p className="text-lg text-zinc-200">Sebastián Montaño</p>
        </div>

        {/* CONTACTO */}
        <div className="text-center border-t border-zinc-800 pt-12">
          <h3 className="text-xl font-semibold mb-6 text-white">
            Información de Contacto
          </h3>

          <p className="text-zinc-400">KRA 32C #35-23, BR Primavera</p>
          <p className="text-zinc-400">
            76001 Cali, Valle del Cauca - Colombia
          </p>
          <p className="mt-4 text-zinc-300">Tel: +57 317 724 8656</p>
          <p className="text-zinc-300">tesoluciona3d@gmail.com</p>
        </div>
      </div>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Tesoluciona3D",
            image: "https://tusitio.com/logo.png",
            address: {
              "@type": "PostalAddress",
              streetAddress: "KRA 32C #35-23, BR Primavera",
              addressLocality: "Cali",
              postalCode: "76001",
              addressRegion: "Valle del Cauca",
              addressCountry: "CO",
            },
            telephone: "+573177248656",
            email: "tesoluciona3d@gmail.com",
            founder: "Sebastián Montaño",
            description:
              "Empresa especializada en impresión 3D personalizada, prototipado y fabricación digital en Cali, Colombia.",
          }),
        }}
      />
    </section>
  );
}
