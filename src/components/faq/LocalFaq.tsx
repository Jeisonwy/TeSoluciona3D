import { Helmet } from "react-helmet-async";

import { siteConfig } from "@/lib/siteConfig";

const faqItems = [
  {
    question: "¿Cuánto cuesta una impresión 3D en Cali?",
    answer:
      "El precio depende del tamaño, material, complejidad, tiempo de impresión y acabado. En Tesoluciona3D revisamos tu archivo o referencia y te enviamos una cotización clara por WhatsApp en el menor tiempo posible.",
  },
  {
    question: "¿Qué archivo necesito para cotizar una pieza 3D?",
    answer:
      "Podemos trabajar con archivos STL, OBJ o referencias en imagen. Si aún no tienes el modelo, también te ayudamos con el modelado y la preparación del archivo para impresión.",
  },
  {
    question: "¿Trabajan materiales como PLA, PETG y TPU?",
    answer:
      "Sí. Fabricamos piezas en PLA, PETG, ABS, TPU y otros materiales según el tipo de proyecto, resistencia requerida y uso final.",
  },
  {
    question: "¿Hacen prototipos urgentes o producción corta?",
    answer:
      "Sí. Atendemos prototipos funcionales, piezas únicas y lotes pequeños para pruebas, validación de diseño y necesidades comerciales en Cali y Valle del Cauca.",
  },
  {
    question: "¿Pueden fabricar piezas personalizadas por unidad?",
    answer:
      "Sí. Diseñamos y fabricamos piezas personalizadas por unidad o en series cortas para repuestos, prototipos, maquetas, accesorios y soluciones a medida.",
  },
];

export default function LocalFaq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="relative w-full py-16" aria-labelledby="faq-heading">
      <Helmet>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Helmet>

      <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-heading"
            className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
          >
            Resolvemos tus dudas sobre impresión 3D
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
            Si quieres cotizar una pieza, prototipo o repuesto, te ayudamos a
            definir el mejor material, tiempos de entrega y alcance del proyecto
            desde {siteConfig.city}, {siteConfig.region}.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6"
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                {item.question}
              </summary>
              <p className="mt-4 leading-relaxed text-slate-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
