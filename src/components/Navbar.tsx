import { useEffect, useRef, useState } from "react";
import { Menu, X, LogIn } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (currentScroll > lastScrollY.current && currentScroll > 100) {
            // Scroll hacia abajo
            setShowNavbar(false);
          } else {
            // Scroll hacia arriba
            setShowNavbar(true);
          }

          lastScrollY.current = currentScroll;
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Inicio", href: "#" },
    { label: "Nosotros", href: "#nosotros" },
    { label: "Servicios", href: "#servicios" },
    { label: "Productos", href: "#productos" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md transition-all duration-300 ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-full shadow border border-white/10"
          >
            <Menu size={18} />
            Menú
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/src/img/favicon.png"
              alt="Logo TESOLUCIONA 3D"
              className="w-12 h-12"
            />
            <span className="text-2xl font-black italic tracking-tighter text-white">
              TESOLUCIONA 3D
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-rose-400 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {!showNavbar && (
        <button
          onClick={() => setShowNavbar(true)}
          className="fixed top-6 right-6 z-[60] bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-full shadow-xl border border-white/10 backdrop-blur-md transition-all duration-300"
        >
          <Menu size={18} />
        </button>
      )}

      {/* OVERLAY MOBILE */}
      <div
        className={`md:hidden fixed inset-0 z-[70] transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/60"
          aria-label="Cerrar menú"
        />

        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-zinc-950/95 border-l border-white/10 backdrop-blur-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="/src/img/favicon.png"
                alt="Logo TESOLUCIONA 3D"
                className="w-10 h-10"
              />
              <span className="text-lg font-black italic tracking-tighter text-white">
                TESOLUCIONA 3D
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 py-6">
            <div className="flex flex-col gap-2 text-slate-200">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-3 rounded-2xl text-sm font-medium transition-all border border-white/10"
              >
                <LogIn size={18} />
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </>
  );
}
