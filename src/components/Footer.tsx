import { Printer } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-zinc-950">
      <div className="max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Printer className="text-rose-500 w-6 h-6" />
          <span
            className="font-brand text-lg sm:text-xl tracking-[0.06em] leading-none uppercase"
            style={{ fontFamily: '"FatalFighter", system-ui, sans-serif' }}
          >
            TESOLUCIONA3D
          </span>
        </div>

        <p className="text-slate-500 text-sm">
          © 2026 TeSoluciona3D. Todos los derechos reservados.
        </p>

        <div className="flex gap-6 text-slate-400">
          <a
            href="https://www.instagram.com/tesoluciona3d/"
            className="hover:text-rose-400 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@tesoluciona3d"
            className="hover:text-rose-400 transition-colors"
          >
            Tiktok
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61553602637861"
            className="hover:text-rose-400 transition-colors"
          >
            Facebook
          </a>
        </div>
        <p className="text-slate-500 text-sm">
          With 💙 by {}
          <a
            href="https://jeisonwy.github.io/Json-Page/"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Json
          </a>
        </p>
      </div>
    </footer>
  );
}
