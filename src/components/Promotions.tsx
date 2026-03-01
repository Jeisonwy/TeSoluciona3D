import React, { useEffect, useMemo, useRef, useState } from "react";

type ApiResponse = {
  success: boolean;
  data: Promotion[];
  message?: string;
};

export type Promotion = {
  id: string;
  TypeOfEvent: string;
  productName: string;
  description: string;
  cost: number;
  category: string;
  discount: number;
  timeToDelivery: string;
  img1?: string;
  img2?: string;
  img3?: string;
  status: boolean;
  showMainPromotion: boolean;
};

type SortMode =
  | "relevance"
  | "name_asc"
  | "discount_desc"
  | "price_asc"
  | "price_desc";

type Props = {
  endpoint?: string;
  onlyActive?: boolean;
  oncePerSession?: boolean;
  autoPlayMs?: number;
};

const DEFAULT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz4qsIjQzuk64K4l9IlZ_qcA0pZVXge5mo7FfJB7gh0F4R5d3qks_Vphe0kcRVLYSQdaA/exec?action=promotions";

const SESSION_KEY = "TESO_MAIN_PROMO_SEEN";

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function clampDiscount(d: number) {
  if (!Number.isFinite(d)) return 0;
  return Math.max(0, Math.min(100, d));
}

function discountedPrice(cost: number, discountPct: number) {
  const d = clampDiscount(discountPct);
  return Math.round(cost * (1 - d / 100));
}

function getImages(p: Promotion) {
  return [p.img1, p.img2, p.img3].filter(Boolean) as string[];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function Promotions({
  endpoint = DEFAULT_ENDPOINT,
  onlyActive = true,
  oncePerSession = true,
  autoPlayMs = 3500,
}: Props) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [query, setQuery] = useState("");
  const [eventType, setEventType] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("relevance");
  const [showFilters, setShowFilters] = useState(false);
  // Dropdown custom
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Imágenes seleccionadas por promo
  const [activeImgById, setActiveImgById] = useState<Record<string, string>>(
    {},
  );

  // Modal principal
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [mainPromoId, setMainPromoId] = useState<string | null>(null);

  const globalMainPromo = useMemo(
    () => promotions.find((p) => p.showMainPromotion),
    [promotions],
  );

  // Carrusel Desktop
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pauseRef = useRef(false);
  pauseRef.current = isPaused;

  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const CACHE_KEY = `promotions_cache_${endpoint}`;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        // 1. REVISAR LA CACHÉ PRIMERO
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);

          if (Array.isArray(parsed)) {
            if (!alive) return;

            // Si hay caché, configuramos el estado y terminamos rápido
            setPromotions(parsed);

            const firstImgs: Record<string, string> = {};
            for (const p of parsed) {
              const imgs = getImages(p);
              if (imgs[0]) firstImgs[p.id] = imgs[0];
            }
            setActiveImgById(firstImgs);

            const main = parsed.find((p) => p.showMainPromotion);
            if (main) {
              setMainPromoId(main.id);
              const seen = oncePerSession
                ? sessionStorage.getItem(SESSION_KEY)
                : null;
              if (!oncePerSession || seen !== "1") {
                setIsMainModalOpen(true);
                if (oncePerSession) sessionStorage.setItem(SESSION_KEY, "1");
              }
            } else {
              setMainPromoId(null);
              setIsMainModalOpen(false);
            }

            setLoading(false);
            return; // ¡Salimos aquí si había caché!
          }
        }

        // 2. SI NO HAY CACHÉ, CONSULTAR LA API
        const res = await fetch(endpoint, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const json = (await res.json()) as ApiResponse;

        if (!json?.success || !Array.isArray(json.data)) {
          throw new Error(json?.message || "Respuesta inválida del API");
        }

        const normalized = json.data
          .filter((p) => (onlyActive ? Boolean(p.status) === true : true))
          .map((p) => ({
            ...p,
            cost: Number(p.cost) || 0,
            discount: Number(p.discount) || 0,
            status: Boolean(p.status),
            showMainPromotion: Boolean(p.showMainPromotion),
            TypeOfEvent: String(p.TypeOfEvent ?? ""),
          }));

        if (!alive) return;

        // Guardamos en la caché para futuras visitas
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
        setPromotions(normalized);

        const firstImgs: Record<string, string> = {};
        for (const p of normalized) {
          const imgs = getImages(p);
          if (imgs[0]) firstImgs[p.id] = imgs[0];
        }
        setActiveImgById(firstImgs);

        const main = normalized.find((p) => p.showMainPromotion);
        if (main) {
          setMainPromoId(main.id);
          const seen = oncePerSession
            ? sessionStorage.getItem(SESSION_KEY)
            : null;
          if (!oncePerSession || seen !== "1") {
            setIsMainModalOpen(true);
            if (oncePerSession) sessionStorage.setItem(SESSION_KEY, "1");
          }
        } else {
          setMainPromoId(null);
          setIsMainModalOpen(false);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Error cargando promociones");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [endpoint, onlyActive, oncePerSession]);

  const eventOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of promotions) {
      if (p.TypeOfEvent) set.add(p.TypeOfEvent);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [promotions]);

  const selectedEventLabel =
    eventType === "all" ? "Todos los eventos" : eventType;

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "relevance", label: "Orden: Normal" },
    { value: "name_asc", label: "Nombre (A-Z)" },
    { value: "discount_desc", label: "Mayor descuento" },
    { value: "price_asc", label: "Precio (menor → mayor)" },
    { value: "price_desc", label: "Precio (mayor → menor)" },
  ];

  const selectedSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "Orden";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = promotions.filter((p) => {
      const inEvent = eventType === "all" ? true : p.TypeOfEvent === eventType;
      if (!inEvent) return false;
      if (!q) return true;
      const hay =
        `${p.productName} ${p.description} ${p.category} ${p.TypeOfEvent} ${p.id}`.toLowerCase();
      return hay.includes(q);
    });

    switch (sort) {
      case "name_asc":
        list = list
          .slice()
          .sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "discount_desc":
        list = list
          .slice()
          .sort(
            (a, b) => clampDiscount(b.discount) - clampDiscount(a.discount),
          );
        break;
      case "price_asc":
        list = list
          .slice()
          .sort(
            (a, b) =>
              discountedPrice(a.cost, a.discount) -
              discountedPrice(b.cost, b.discount),
          );
        break;
      case "price_desc":
        list = list
          .slice()
          .sort(
            (a, b) =>
              discountedPrice(b.cost, b.discount) -
              discountedPrice(a.cost, a.discount),
          );
        break;
      case "relevance":
      default:
        break;
    }
    return list;
  }, [promotions, query, eventType, sort]);

  useEffect(() => {
    setIsEventOpen(false);
    setIsSortOpen(false);
    setActiveIndex(0);
  }, [query, eventType, sort]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (filtered.length <= 1) return;
    const id = window.setInterval(
      () => {
        if (pauseRef.current) return;

        if (window.innerWidth >= 768) {
          setActiveIndex((i) => (i + 1) % filtered.length);
        } else {
          if (mobileScrollRef.current) {
            const el = mobileScrollRef.current;
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft >= maxScroll - 20) {
              el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              el.scrollBy({ left: el.clientWidth + 16, behavior: "smooth" });
            }
          }
        }
      },
      Math.max(1500, autoPlayMs),
    );

    return () => window.clearInterval(id);
  }, [filtered.length, autoPlayMs, prefersReducedMotion]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMainModalOpen(false);
    }
    if (isMainModalOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMainModalOpen]);

  const mainPromotion = useMemo(() => {
    if (!mainPromoId) return null;
    return promotions.find((p) => p.id === mainPromoId) || null;
  }, [promotions, mainPromoId]);

  const safeActiveIndex = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, filtered.length - 1),
  );

  const goPrev = () => {
    if (filtered.length <= 1) return;
    setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };

  const goNext = () => {
    if (filtered.length <= 1) return;
    setActiveIndex((i) => (i + 1) % filtered.length);
  };

  const handleOpenPromo = (p: Promotion) => {
    setMainPromoId(p.id);
    setIsMainModalOpen(true);
    const imgs = getImages(p);
    if (imgs[0]) setActiveImgById((prev) => ({ ...prev, [p.id]: imgs[0] }));
  };

  return (
    <section
      className="relative max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8"
      id="promotions"
    >
      {/* Header / Título / Toggle */}
      <div className="flex items-center justify-between gap-6 flex-wrap mb-2">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Promociones
          </h2>
          <p className="text-sm opacity-70 mt-1">
            {loading ? "Cargando..." : `${filtered.length} resultado(s)`}
          </p>
        </div>

        <button
          onClick={() => {
            setShowFilters(!showFilters);
            setIsEventOpen(false);
            setIsSortOpen(false);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          <span
            className={`transition-transform duration-300 ${
              showFilters ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Contenedor de Filtros con animación Grid */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          showFilters
            ? "grid-rows-[1fr] opacity-100 mb-6"
            : "grid-rows-[0fr] opacity-0 mb-0"
        } ${isEventOpen || isSortOpen ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div className="min-h-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full pt-2">
            {/* 1. Input de Búsqueda */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar promo..."
              className="w-full sm:w-64 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none transition-shadow focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />

            {/* 2. Dropdown de Eventos */}
            <div className="relative w-full sm:w-48">
              <button
                type="button"
                onClick={() => {
                  setIsEventOpen((prev) => !prev);
                  setIsSortOpen(false);
                }}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 text-left shadow-sm flex items-center justify-between outline-none"
              >
                <span className="truncate">{selectedEventLabel}</span>
                <span className="opacity-60 text-sm">▼</span>
              </button>
              {isEventOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md shadow-lg overflow-hidden">
                  {eventOptions.map((ev) => (
                    <button
                      key={ev}
                      type="button"
                      onClick={() => {
                        setEventType(ev);
                        setIsEventOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition ${ev === eventType ? "bg-black/10 dark:bg-white/15" : ""}`}
                    >
                      {ev === "all" ? "Todos los eventos" : ev}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Dropdown de Orden */}
            <div className="relative w-full sm:w-48">
              <button
                type="button"
                onClick={() => {
                  setIsSortOpen((prev) => !prev);
                  setIsEventOpen(false);
                }}
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 text-left shadow-sm flex items-center justify-between outline-none"
              >
                <span className="truncate">{selectedSortLabel}</span>
                <span className="opacity-60 text-sm">▼</span>
              </button>
              {isSortOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md shadow-lg overflow-hidden">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSort(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-black/10 dark:hover:bg-white/10 transition ${opt.value === sort ? "bg-black/10 dark:bg-white/15" : ""}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estados */}
      <div className="mt-2 w-full overflow-hidden">
        {loading && (
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
            Cargando promociones…
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold">
              No se pudieron cargar las promociones
            </div>
            <div className="text-sm opacity-80">{error}</div>
            <button
              className="mt-3 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 text-center opacity-80">
            No hay promociones con esos filtros.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            {/* ====== VISTA MÓVIL (Scroll horizontal) ====== */}
            <div
              className="block md:hidden relative mt-4"
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <div
                ref={mobileScrollRef}
                className="grid grid-flow-col auto-cols-[100%] overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden w-full"
              >
                {filtered.map((p) => (
                  <div key={p.id}>
                    <MobilePromotionCard
                      promo={p}
                      activeImg={activeImgById[p.id]}
                      onOpenMain={() => handleOpenPromo(p)}
                    />
                  </div>
                ))}
              </div>

              <div className="text-center text-xs opacity-50 mt-[-10px] pb-4">
                Desliza para ver más →
              </div>
            </div>

            {/* ====== VISTA DESKTOP (Carrusel con Animación) ====== */}
            <div
              className="hidden md:block relative w-full my-6"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocusCapture={() => setIsPaused(true)}
              onBlurCapture={() => setIsPaused(false)}
            >
              <div className="relative overflow-hidden py-10 w-full">
                {filtered.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg hover:scale-105 hover:bg-white dark:hover:bg-[#1a2233] transition-all disabled:opacity-40"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-lg hover:scale-105 hover:bg-white dark:hover:bg-[#1a2233] transition-all disabled:opacity-40"
                    >
                      ▶
                    </button>
                  </>
                )}

                <CarouselTrack<Promotion>
                  items={filtered}
                  activeIndex={safeActiveIndex}
                  renderItem={(p, isActive) => (
                    <CarouselPromotionCard
                      promo={p}
                      isActive={isActive}
                      activeImg={activeImgById[p.id]}
                      onOpenMain={() => handleOpenPromo(p)}
                      onFocusMe={() => {
                        const idx = filtered.findIndex((f) => f.id === p.id);
                        if (idx >= 0) setActiveIndex(idx);
                      }}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 overflow-auto max-w-full px-4 py-1">
                  {filtered.slice(0, 30).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`h-2.5 rounded-full transition-all border ${i === safeActiveIndex ? "w-8 border-black/30 dark:border-white/30 bg-black/50 dark:bg-white/50" : "w-2.5 border-black/10 dark:border-white/10 bg-black/10 dark:bg-white/10 opacity-70 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {globalMainPromo && !isMainModalOpen && (
        <MainPromoFAB onClick={() => handleOpenPromo(globalMainPromo)} />
      )}
      {isMainModalOpen && mainPromotion && (
        <MainPromotionModal
          promo={mainPromotion}
          activeImg={activeImgById[mainPromotion.id]}
          onSelectImg={(url: string) =>
            setActiveImgById((prev) => ({ ...prev, [mainPromotion.id]: url }))
          }
          onClose={() => setIsMainModalOpen(false)}
        />
      )}
    </section>
  );
}

// ==============================================
// SUB-COMPONENTES
// ==============================================

function MainPromoFAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 left-4 sm:left-8 z-[90] animate-bounce hover:scale-110 transition-transform focus:outline-none"
      aria-label="Ver Promoción Principal"
    >
      <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 text-white font-black drop-shadow-2xl">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-red-600 fill-current drop-shadow-lg"
        >
          <path d="M50 0 L58 15 L74 11 L75 27 L90 32 L81 46 L94 58 L78 65 L81 81 L65 76 L55 90 L42 81 L26 89 L25 73 L9 70 L20 56 L6 43 L22 36 L19 20 L35 25 L44 10 Z" />
        </svg>
        <span className="relative z-10 text-center leading-[1.1] tracking-tighter text-[13px] sm:text-[15px] origin-center rotate-[-12deg] shadow-black drop-shadow-md">
          ¡OFERTA
          <br />
          ESTRELLA!
        </span>
      </div>
    </button>
  );
}

function MobilePromotionCard({
  promo: p,
  activeImg,
  onOpenMain,
}: {
  promo: Promotion;
  activeImg?: string;
  onOpenMain: () => void;
}) {
  const finalPrice = discountedPrice(p.cost, p.discount);

  return (
    <article className="snap-center h-full rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#1a2233] shadow-lg flex flex-col">
      <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/5">
        <img
          src={activeImg}
          alt={p.productName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {p.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
            -{p.discount}%
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold truncate">{p.productName}</h3>
          <p className="text-xs opacity-60 mt-1 truncate">{p.category}</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-black text-xl text-blue-600 dark:text-blue-400">
              {formatCOP(finalPrice)}
            </p>
          </div>
          <button
            onClick={onOpenMain}
            className="bg-black dark:bg-white text-white dark:text-black hover:scale-105 px-4 py-2 rounded-xl text-sm font-medium shadow-md"
          >
            Ver promo
          </button>
        </div>
      </div>
    </article>
  );
}

function CarouselTrack<T>({
  items,
  activeIndex,
  renderItem,
}: {
  items: T[];
  activeIndex: number;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
}) {
  const cardW = 280;
  const gap = 20;

  const isLoopable = items.length > 1;
  const extendedItems = isLoopable
    ? [...items, ...items, ...items, ...items, ...items]
    : items;

  const realActiveIndex = isLoopable
    ? activeIndex + items.length * 2
    : activeIndex;

  return (
    <div
      className="flex items-stretch will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] w-full"
      style={{
        transform: `translateX(calc(50% - ${
          realActiveIndex * (cardW + gap) + cardW / 2
        }px))`,
      }}
    >
      {extendedItems.map((it, idx) => {
        const isActive = idx === realActiveIndex;

        return (
          <div
            key={idx}
            className="shrink-0 transition-all duration-700"
            style={{ width: `${cardW}px`, marginRight: `${gap}px` }}
          >
            {renderItem(it, isActive)}
          </div>
        );
      })}
    </div>
  );
}

function CarouselPromotionCard({
  promo: p,
  isActive,
  activeImg,
  onOpenMain,
  onFocusMe,
}: {
  promo: Promotion;
  isActive: boolean;
  activeImg?: string;
  onOpenMain: () => void;
  onFocusMe: () => void;
}) {
  const finalPrice = discountedPrice(p.cost, p.discount);

  return (
    <article
      className={`relative h-full rounded-3xl overflow-hidden border transition-all duration-700 ease-out ${isActive ? "z-20 scale-[1.05] border-blue-500/50 bg-white dark:bg-[#1a2233] shadow-2xl ring-2 ring-blue-500/20 cursor-default" : "z-10 scale-95 border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0b1220]/60 opacity-75 hover:opacity-100 cursor-pointer"}`}
      onClick={() => {
        if (!isActive) onFocusMe();
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5 dark:bg-white/5">
        <img
          src={activeImg}
          alt={p.productName}
          className={`h-full w-full object-cover transition-transform duration-[2s] ${isActive ? "scale-105" : "scale-100"}`}
          loading="lazy"
        />
        {isActive && p.discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">
            -{p.discount}%
          </div>
        )}
      </div>
      <div
        className={`p-5 transition-opacity duration-500 flex flex-col justify-between ${isActive ? "opacity-100" : "opacity-90"}`}
      >
        <div>
          <h3 className="text-lg font-bold truncate leading-tight">
            {p.productName}
          </h3>
          <p className="text-xs opacity-60 mt-1 truncate">{p.category}</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">
              Precio
            </p>
            <p
              className={`font-black ${isActive ? "text-xl text-blue-600 dark:text-blue-400" : "text-lg"}`}
            >
              {formatCOP(finalPrice)}
            </p>
          </div>
          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMain();
              }}
              className="bg-black dark:bg-white text-white dark:text-black hover:scale-105 px-4 py-2 rounded-xl text-sm font-medium transition-transform shadow-md"
            >
              Ver promo
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function MainPromotionModal({
  promo,
  activeImg,
  onSelectImg,
  onClose,
}: {
  promo: Promotion;
  activeImg?: string;
  onSelectImg: (url: string) => void;
  onClose: () => void;
}) {
  const imgs = getImages(promo);
  const hasDiscount = clampDiscount(promo.discount) > 0;
  const finalPrice = discountedPrice(promo.cost, promo.discount);

  const isSpecial = promo.showMainPromotion;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 mt-10 sm:mt-0">
      <button
        type="button"
        aria-label="Cerrar promoción"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative w-full max-w-3xl transition-all duration-300 ease-out transform ${
          isAnimating
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        {/* Badge Especial flotando arriba (Ahora sí es libre de salirse) */}
        {isSpecial && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] sm:text-xs font-black px-4 sm:px-6 py-1.5 rounded-full shadow-lg uppercase tracking-widest border-2 border-white dark:border-[#0b1220] whitespace-nowrap">
              🔥 Oferta Estrella 🔥
            </span>
          </div>
        )}

        {/* 2. CAJA INTERIOR VISIBLE: Maneja el fondo, bordes y el scroll interno */}
        <div
          className={`w-full max-h-[85vh] overflow-y-auto rounded-3xl border shadow-2xl custom-scrollbar ${
            isSpecial
              ? "border-red-500/50 bg-gradient-to-br from-white via-white to-red-50 dark:from-[#0b1220] dark:via-[#0b1220] dark:to-red-900/20 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
              : "border-white/15 bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur-xl"
          }`}
        >
          <div
            className={`flex items-start justify-between gap-3 p-5 ${isSpecial ? "pt-7" : ""}`}
          >
            <div>
              <div
                className={`text-xs font-medium ${isSpecial ? "text-red-500 dark:text-red-400" : "opacity-70"}`}
              >
                {promo.TypeOfEvent}
              </div>
              <h3
                className={`text-xl font-bold leading-tight mt-1 ${isSpecial ? "text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400" : ""}`}
              >
                {promo.productName}
              </h3>
              <div className="text-xs opacity-70 mt-1">
                {promo.category} • {promo.timeToDelivery}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-black/5 dark:bg-white/5 px-3 py-2 hover:bg-black/10 dark:hover:bg-white/10 transition"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="bg-black/5 dark:bg-white/5 relative">
              <div className="relative aspect-[4/3] w-full">
                {activeImg ? (
                  <img
                    src={activeImg}
                    alt={promo.productName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-sm opacity-60">
                    Sin imagen
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute left-4 top-4 rounded-full bg-red-600 text-white font-bold text-sm px-3 py-1 shadow-lg">
                    -{clampDiscount(promo.discount)}%
                  </div>
                )}
              </div>

              {imgs.length > 1 && (
                <div className="flex gap-2 p-3">
                  {imgs.map((url, index) => (
                    <button
                      type="button"
                      key={`${index}-${url}`}
                      onClick={() => onSelectImg(url)}
                      className={`h-12 w-12 rounded-xl overflow-hidden border transition-all ${
                        url === activeImg
                          ? isSpecial
                            ? "border-red-500 ring-2 ring-red-500/30 scale-105"
                            : "border-black/50 dark:border-white/50"
                          : "border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col">
              <p className="text-sm opacity-85 flex-1">{promo.description}</p>

              <div
                className={`mt-5 rounded-2xl border p-4 ${isSpecial ? "bg-red-500/5 border-red-500/20 dark:bg-red-500/10" : "border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5"}`}
              >
                <div className="text-sm opacity-70">Precio promocional</div>
                <div className="flex items-baseline gap-3 mt-1">
                  <div
                    className={`text-3xl font-black ${isSpecial ? "text-red-600 dark:text-red-400" : ""}`}
                  >
                    {formatCOP(finalPrice)}
                  </div>
                  {hasDiscount && (
                    <div className="text-sm line-through opacity-50 font-medium">
                      {formatCOP(promo.cost)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 transition w-full active:scale-95 font-semibold ${
                    isSpecial
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border-none"
                      : "border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                  onClick={() =>
                    window.open(
                      "http://wa.me/573177248656?text=Hola!%20estoy%20interesado%20en%20la%20oferta%20estrella",
                      "_blank",
                    )
                  }
                >
                  ¡Lo quiero!
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 transition w-full active:scale-95 font-medium ${
                    isSpecial
                      ? "border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                      : "bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02]"
                  }`}
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
