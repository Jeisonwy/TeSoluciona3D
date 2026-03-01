import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

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
            setShowNavbar(false);
          } else {
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
    { label: "Inicio", type: "anchor" as const, href: "#" },
    { label: "Nosotros", type: "route" as const, to: "/nosotros" },
    { label: "Servicios", type: "anchor" as const, href: "#servicios" },
    { label: "Productos", type: "route" as const, to: "/products" },
  ];

  const goToAnchor = (href: string) => {
    // 1. Si NO estamos en la página principal, navegamos a ella con el hash
    if (location.pathname !== "/") {
      navigate("/" + href);
      setOpen(false);
      return;
    }

    // 2. Cerramos el menú móvil (si estaba abierto)
    setOpen(false);

    // 3. Si es "Inicio", forzamos el scroll suave hasta arriba del todo
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Limpiamos la URL visualmente
      window.history.pushState(null, "", "/");
      return;
    }

    // 4. Si es otra sección, buscamos el elemento por su ID
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      // Calculamos la posición restando el alto aproximado de tu navbar (80px)
      // para que el navbar no tape el título de la sección
      const navbarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;

      // Forzamos el scroll suave
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Actualizamos la URL (opcional, pero buena práctica) sin que la página salte
      window.history.pushState(null, "", href);
    } else {
      // Fallback por si el ID no se encuentra
      window.location.hash = href;
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md transition-all duration-300 ${
          showNavbar
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded-full shadow border border-white/10 text-sm"
          >
            <Menu size={18} />
            Menú
          </button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              onClick={() => navigate("/")}
              src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FEs5AvbwsBmmAVF8NRIadZS.Img.075115.png"
              alt="Logo TESOLUCIONA 3D"
              className="w-9 h-9 sm:w-12 sm:h-12 shrink-0"
            />
            <span
              onClick={() => navigate("/")}
              className="font-brand text-lg sm:text-xl tracking-[0.06em] leading-none uppercase"
              style={{ fontFamily: '"FatalFighter", system-ui, sans-serif' }}
            >
              TESOLUCIONA 3D
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navItems.map((item) => {
              if (item.type === "route") {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="hover:text-rose-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => goToAnchor(item.href)}
                  className="hover:text-rose-400 transition-colors"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {!showNavbar && (
        <button
          type="button"
          onClick={() => setShowNavbar(true)}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[60] bg-white/10 hover:bg-white/15 text-white p-2.5 sm:px-4 sm:py-2 rounded-full shadow-xl border border-white/10 backdrop-blur-md transition-all duration-300"
          aria-label="Mostrar menú"
        >
          <Menu size={18} />
        </button>
      )}

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
          <div className="h-16 sm:h-20 px-4 sm:px-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="https://www.appsheet.com/template/gettablefileurl?appName=Imagenes-811224222&tableName=Imagenes&fileName=Imagenes_Images%2FEs5AvbwsBmmAVF8NRIadZS.Img.075115.png"
                alt="Logo TESOLUCIONA 3D"
                className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
              />
              <span
                className="font-brand text-lg sm:text-xl tracking-[0.06em] leading-none uppercase"
                style={{ fontFamily: '"FatalFighter", system-ui, sans-serif' }}
              >
                TESOLUCIONA3D
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-white"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-5 py-6">
            <div className="flex flex-col gap-2 text-slate-200">
              {navItems.map((item) => {
                if (item.type === "route") {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => goToAnchor(item.href)}
                    className="text-left px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6"></div>
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-20" />
    </>
  );
}
