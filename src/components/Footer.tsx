import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Printer,
} from "lucide-react";

import { siteConfig } from "@/lib/siteConfig";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3 3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 py-12">
      {/* Ajusté el grid a 4 columnas en lg (lg:grid-cols-4) para hacer espacio para el mapa. 
        Si prefieres que tome menos espacio, puedes jugar con proporciones como lg:grid-cols-[1.2fr_0.8fr_0.6fr_1.4fr] 
      */}
      <div className="mx-auto grid max-w-[92rem] gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8 xl:max-w-[100rem]">
        {/* Columna 1: Info marca */}
        <div>
          <div className="flex items-center gap-3">
            <Printer className="h-6 w-6 text-rose-500" />
            <span
              className="font-brand text-lg uppercase tracking-[0.06em] sm:text-xl text-white"
              style={{ fontFamily: '"FatalFighter", system-ui, sans-serif' }}
            >
              TESOLUCIONA3D
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Fabricamos prototipos, piezas personalizadas, repuestos y soluciones
            de impresión 3D en Cali. También atendemos corte láser y
            mantenimiento técnico para clientes en Valle del Cauca.
          </p>

          <a
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/15"
          >
            Cotizar por WhatsApp
          </a>
        </div>

        {/* Columna 2: Contacto */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Contacto local
          </h2>
          <address className="mt-4 space-y-4 not-italic text-sm text-slate-300 sm:text-base">
            <a
              href={siteConfig.phoneHref}
              className="flex items-start gap-3 transition-colors hover:text-white"
            >
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{siteConfig.phone}</span>
            </a>

            <a
              href={siteConfig.emailHref}
              className="flex items-start gap-3 transition-colors hover:text-white"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{siteConfig.email}</span>
            </a>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>
                {siteConfig.address}
                <br />
                {siteConfig.postalCode} {siteConfig.city}, {siteConfig.region},
                Colombia
              </span>
            </div>
          </address>
        </div>

        {/* Columna 3: Redes */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Presencia digital
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400 sm:text-base">
            <a
              href={siteConfig.sameAs[0]}
              className="flex items-center gap-2 transition-colors hover:text-rose-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
              <span>Instagram</span>
            </a>
            <a
              href={siteConfig.sameAs[1]}
              className="flex items-center gap-2 transition-colors hover:text-rose-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TikTokIcon className="h-5 w-5" />
              <span>TikTok</span>
            </a>
            <a
              href={siteConfig.sameAs[2]}
              className="flex items-center gap-2 transition-colors hover:text-rose-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
              <span>Facebook</span>
            </a>
          </div>
        </div>

        {/* Columna 4: Mapa (NUEVO) */}
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white mb-4">
            Ubicación
          </h2>
          {/* Contenedor del mapa para asegurar que sea responsivo y se vea bonito */}
          <div className="w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-white/5 relative">
            <iframe
              title="Ubicación de Tesoluciona3D"
              // PASO IMPORTANTE: Cambia esta URL por la URL de "Insertar un mapa" de tu negocio real en Google Maps
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1991.3499357986225!2d-76.5090661!3d3.4230902!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6de07ae6fe9%3A0xf2e2b1b234d31b57!2sCra.%2032c%20%23%2035-23%2C%20Quiroga%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses-419!2sco!4v1772749700788!5m2!1ses-419!2sco"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[92rem] flex-col gap-2 border-t border-white/5 px-4 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:max-w-[100rem]">
        <p>© 2026 Tesoluciona3D. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
