import React, { useEffect, useMemo, useState } from "react";

type ApiResponse = {
  success: boolean;
  data: Product[];
  message?: string;
};

export type Product = {
  id: string;
  productName: string;
  description: string;
  cost: number;
  category: string;
  status: "Activo" | "Inactivo" | string;
  discount: number; // porcentaje 0-100
  timeToDelivery: string;
  img1?: string;
  img2?: string;
  img3?: string;
};
type ViewMode = "grid" | "list";
type SortMode = "relevance" | "name_asc" | "price_asc" | "price_desc";

type Props = {
  endpoint?: string; // por si luego lo cambias
  onlyActive?: boolean; // default true
  pageSize?: number; // default 24 (paginación simple en front)
};
const sortOptions: { value: SortMode; label: string }[] = [
  { value: "relevance", label: "Orden: backend" },
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "price_asc", label: "Precio (menor → mayor)" },
  { value: "price_desc", label: "Precio (mayor → menor)" },
];
const DEFAULT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz4qsIjQzuk64K4l9IlZ_qcA0pZVXge5mo7FfJB7gh0F4R5d3qks_Vphe0kcRVLYSQdaA/exec?action=products";

function formatCOP(value: number) {
  // COP normalmente no usa decimales
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

function getImages(p: Product) {
  return [p.img1, p.img2, p.img3].filter(Boolean) as string[];
}

export default function Products({
  endpoint = DEFAULT_ENDPOINT,
  onlyActive = true,
  pageSize = 24,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("relevance");
  const [page, setPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  // Para manejar imagen seleccionada por producto
  const [activeImgById, setActiveImgById] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        // Nota: NO uses mode:"no-cors" porque te devuelve respuesta opaca y no podrás leer JSON.
        const res = await fetch(endpoint, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const json = (await res.json()) as ApiResponse;

        if (!json?.success || !Array.isArray(json.data)) {
          throw new Error(json?.message || "Respuesta inválida del API");
        }

        const normalized = json.data
          .filter((p) =>
            onlyActive ? String(p.status).toLowerCase() === "activo" : true,
          )
          .map((p) => ({
            ...p,
            cost: Number(p.cost) || 0,
            discount: Number(p.discount) || 0,
          }));

        if (!alive) return;

        setProducts(normalized);

        // Setear imagen activa por defecto (img1 si existe)
        const firstImgs: Record<string, string> = {};
        for (const p of normalized) {
          const imgs = getImages(p);
          if (imgs[0]) firstImgs[p.id] = imgs[0];
        }
        setActiveImgById(firstImgs);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || "Error cargando productos");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [endpoint, onlyActive]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category) set.add(p.category);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const selectedCategoryLabel =
    categories.find((c) => c === category) === "all"
      ? "Todas las categorías"
      : category;

  const selectedSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "Orden";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      const inCategory = category === "all" ? true : p.category === category;
      if (!inCategory) return false;

      if (!q) return true;

      const hay =
        `${p.productName} ${p.description} ${p.category} ${p.id}`.toLowerCase();

      return hay.includes(q);
    });

    switch (sort) {
      case "name_asc":
        list = list
          .slice()
          .sort((a, b) => a.productName.localeCompare(b.productName));
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
        // “relevance” = deja el orden del backend
        break;
    }

    return list;
  }, [products, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    // si cambian filtros, vuelve a página 1
    setPage(1);
  }, [query, category, sort, pageSize]);

  const containerClass =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      : "flex flex-col gap-3";

  return (
    <section
      className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8"
      id="products"
    >
      {/* Header / Controles */}
      <div className="flex items-end justify-between gap-6 flex-wrap mb-6">
        <div>
          <h2 className="text-xl font-semibold">Productos</h2>
          <p className="text-sm opacity-70">
            {loading ? "Cargando..." : `${filtered.length} resultado(s)`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar (nombre, categoría, ID...)"
            className="w-full sm:w-64 rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 px-3 py-2 outline-none"
          />

          <div className="relative w-full sm:w-56">
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="
      w-full rounded-xl
      border border-black/10 dark:border-white/10
      bg-white/80 dark:bg-white/5
      px-3 py-2
      text-left
      shadow-sm
      flex items-center justify-between
      outline-none
    "
            >
              <span className="truncate">{selectedCategoryLabel}</span>
              <span className="opacity-60 text-sm">▼</span>
            </button>

            {isCategoryOpen && (
              <div
                className="
                    absolute z-50 mt-2 w-full
                    rounded-xl
                    border border-black/10 dark:border-white/10
                    bg-white/80 dark:bg-[#0b1220]/80
                    backdrop-blur-md
                    shadow-lg
                    overflow-hidden
  "
              >
                {categories.map((c) => {
                  const label = c === "all" ? "Todas las categorías" : c;
                  const isActive = c === category;

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setIsCategoryOpen(false);
                      }}
                      className={`
              w-full px-3 py-2 text-left
              hover:bg-black/5 dark:hover:bg-white/10
              transition 
              ${isActive ? "bg-black/5 dark:bg-white/10" : ""}
            `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative w-full sm:w-56">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="
      w-full rounded-xl
      border border-black/10 dark:border-white/10
      bg-white/80 dark:bg-white/5
      px-3 py-2
      text-left
      shadow-sm
      flex items-center justify-between
      outline-none
    "
            >
              <span className="truncate">{selectedSortLabel}</span>
              <span className="opacity-60 text-sm">▼</span>
            </button>

            {isSortOpen && (
              <div
                className="
        absolute z-50 mt-2 w-full
        rounded-xl
        border border-black/10 dark:border-white/10
        bg-white/80 dark:bg-[#0b1220]/80
        backdrop-blur-md
        shadow-lg
        overflow-hidden
      "
              >
                {sortOptions.map((opt) => {
                  const isActive = opt.value === sort;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSort(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`
              w-full px-3 py-2 text-left
              hover:bg-black/10 dark:hover:bg-white/10
              transition
              ${isActive ? "bg-black/10 dark:bg-white/15" : ""}
            `}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`rounded-xl px-3 py-2 border ${
                view === "grid"
                  ? "border-black/20 dark:border-white/20"
                  : "border-black/10 dark:border-white/10 opacity-70"
              }`}
              type="button"
            >
              Cuadrícula
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-xl px-3 py-2 border ${
                view === "list"
                  ? "border-black/20 dark:border-white/20"
                  : "border-black/10 dark:border-white/10 opacity-70"
              }`}
              type="button"
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Estados */}
      <div className="mt-5">
        {loading && (
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
            Cargando productos…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="font-semibold">
              No se pudieron cargar los productos
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
            No hay productos con esos filtros.
          </div>
        )}

        {/* Listado */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className={containerClass}>
              {paged.map((p) => (
                <ProductCard
                  product={p}
                  view={view}
                  activeImg={activeImgById[p.id]}
                  onSelectImg={(url) =>
                    setActiveImgById((prev) => ({ ...prev, [p.id]: url }))
                  }
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 disabled:opacity-50"
                  onClick={() => setPage((n) => Math.max(1, n - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>

                <div className="text-sm opacity-80">
                  Página <b>{currentPage}</b> de <b>{totalPages}</b>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 disabled:opacity-50"
                  onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProductCard({
  product: p,
  view,
  activeImg,
  onSelectImg,
}: {
  product: Product;
  view: ViewMode;
  activeImg?: string;
  onSelectImg: (url: string) => void;
}) {
  const imgs = getImages(p);
  const hasDiscount = clampDiscount(p.discount) > 0;
  const finalPrice = discountedPrice(p.cost, p.discount);

  const wrapper =
    "rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 overflow-hidden";
  const bodyPadding = view === "grid" ? "p-4" : "p-4 sm:p-5";

  return (
    <article className={wrapper}>
      <div className={view === "grid" ? "" : "sm:flex"}>
        {/* Imagen */}
        <div className={view === "grid" ? "" : "sm:w-56 sm:shrink-0"}>
          <div className="relative aspect-[4/3] w-full bg-black/5 dark:bg-white/5">
            {activeImg ? (
              <img
                src={activeImg}
                alt={p.productName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full grid place-items-center text-sm opacity-60">
                Sin imagen
              </div>
            )}

            {hasDiscount && (
              <div className="absolute left-3 top-3 rounded-full bg-black/70 text-white text-xs px-2 py-1">
                -{clampDiscount(p.discount)}%
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {imgs.length > 1 && (
            <div className="flex gap-2 p-3">
              {imgs.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => onSelectImg(url)}
                  className={`h-12 w-12 rounded-xl overflow-hidden border ${
                    url === activeImg
                      ? "border-black/30 dark:border-white/30"
                      : "border-black/10 dark:border-white/10 opacity-80"
                  }`}
                  title="Ver imagen"
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

        {/* Info */}
        <div className={`flex-1 ${bodyPadding}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-tight">{p.productName}</h3>
              <p className="text-xs opacity-70 mt-1">
                {p.category} • {p.timeToDelivery}
              </p>
            </div>

            <span className="text-xs rounded-full border border-black/10 dark:border-white/10 px-2 py-1 opacity-70">
              {p.id}
            </span>
          </div>

          <p className="text-sm opacity-85 mt-3 line-clamp-3">
            {p.description}
          </p>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Precio</div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-semibold">
                  {formatCOP(finalPrice)}
                </div>
                {hasDiscount && (
                  <div className="text-sm line-through opacity-50">
                    {formatCOP(p.cost)}
                  </div>
                )}
              </div>
            </div>

            {/* CTA (placeholder) */}
            <button
              type="button"
              className="rounded-xl px-4 py-2 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition"
              onClick={() => {
                // Aquí luego conectas WhatsApp / modal / carrito / etc.
                // Ej: window.open(`https://wa.me/57XXXXXXXXXX?text=${encodeURIComponent(...)}`)
                alert(`Interés en: ${p.productName}`);
              }}
            >
              Me interesa
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
