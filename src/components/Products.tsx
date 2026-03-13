import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Breadcrumbs from "./seo/Breadcrumbs";

function useLoader() {
  const start = () => {};
  const stop = () => {};
  const setStatus = (status: string) => {};
  return { start, stop, setStatus };
}

type ApiResponse = {
  success: boolean;
  data: Product[];
  message?: string;
};

type ProductImage = {
  id: string | number;
  image_url: string;
};

export type Product = {
  id: string;
  productName: string;
  description: string;
  cost: number | string;
  category: string;
  status: "Activo" | "Inactivo" | string;
  discount: number;
  timeToDelivery: string;
  TextLabel?: string;
  color?: string;
  image_url?: string;
  images?: ProductImage[];
};

type ViewMode = "grid" | "list";
type SortMode = "relevance" | "name_asc" | "price_asc" | "price_desc";

type Props = {
  endpoint?: string;
  onlyActive?: boolean;
  pageSize?: number;
};

const sortOptions: { value: SortMode; label: string }[] = [
  { value: "relevance", label: "Orden: Normal" },
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "price_asc", label: "Precio (menor → mayor)" },
  { value: "price_desc", label: "Precio (mayor → menor)" },
];

const DEFAULT_ENDPOINT = "/api/get_products.php";

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

function normalizeImageUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${window.location.origin}${url}`;
}

function getImages(p: Product) {
  if (Array.isArray(p.images) && p.images.length > 0) {
    return p.images
      .map((img) => normalizeImageUrl(img.image_url))
      .filter(Boolean);
  }

  if (p.image_url) {
    return [normalizeImageUrl(p.image_url)];
  }

  return [];
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
  const [labelFilter, setLabelFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortMode>("relevance");
  const [page, setPage] = useState(1);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeImgById, setActiveImgById] = useState<Record<string, string>>(
    {},
  );

  const { start, stop, setStatus } = useLoader();

  useEffect(() => {
    let alive = true;
    // 🔥 CAMBIO DE CACHÉ: Cambiamos el nombre para que borre la data vieja
    const CACHE_KEY = `products_cache_v2_${endpoint}`;

    async function run() {
      start();
      setStatus("Cargando productos...");

      try {
        setLoading(true);
        setError(null);

        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);

          if (!Array.isArray(parsed)) {
            sessionStorage.removeItem(CACHE_KEY);
          } else {
            const parsedCache = parsed as Product[];
            if (!alive) return;

            setProducts(parsedCache);

            const firstImgs: Record<string, string> = {};
            for (const p of parsedCache) {
              const imgs = getImages(p);
              if (imgs[0]) firstImgs[p.id] = imgs[0];
            }
            setActiveImgById(firstImgs);
            setLoading(false);
            return;
          }
        }

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
          .filter((p) =>
            onlyActive ? String(p.status).toLowerCase() === "activo" : true,
          )
          .map((p) => {
            let parsedCost = p.cost;

            if (
              parsedCost === "" ||
              parsedCost === null ||
              parsedCost === undefined
            ) {
              parsedCost = 0;
            } else if (!isNaN(Number(parsedCost))) {
              parsedCost = Number(parsedCost);
            }

            return {
              ...p,
              cost: parsedCost,
              discount: Number(p.discount) || 0,
              TextLabel: p.TextLabel || "",
              color: p.color || "",
              image_url: p.image_url ? normalizeImageUrl(p.image_url) : "",
              images: Array.isArray(p.images)
                ? p.images.map((img) => ({
                    ...img,
                    image_url: normalizeImageUrl(img.image_url),
                  }))
                : [],
            };
          });

        if (!alive) return;

        setProducts(normalized);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(normalized));

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
        setStatus("Iniciando sistema...");
        stop();
      }
    }

    run();
    return () => {
      alive = false;
      stop();
    };
  }, [endpoint, onlyActive]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.category) set.add(p.category);
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const labels = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      if (p.TextLabel && p.TextLabel.trim() !== "") {
        set.add(p.TextLabel.trim());
      }
    }
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const selectedCategoryLabel =
    categories.find((c) => c === category) === "all"
      ? "Todas las categorías"
      : category;

  const selectedLabelFilter =
    labels.find((l) => l === labelFilter) === "all"
      ? "Todas las etiquetas"
      : labelFilter;

  const selectedSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "Orden";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => {
      const inCategory = category === "all" ? true : p.category === category;
      const pText = p.TextLabel ? p.TextLabel.trim() : "";
      const inLabel = labelFilter === "all" ? true : pText === labelFilter;

      if (!inCategory || !inLabel) return false;
      if (!q) return true;

      const hay =
        `${p.productName} ${p.description} ${p.category} ${p.id} ${pText}`.toLowerCase();

      return hay.includes(q);
    });

    switch (sort) {
      case "name_asc":
        list = list
          .slice()
          .sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "price_asc":
        list = list.slice().sort((a, b) => {
          const costA = typeof a.cost === "number" ? a.cost : 999999999;
          const costB = typeof b.cost === "number" ? b.cost : 999999999;
          return (
            discountedPrice(costA, a.discount) -
            discountedPrice(costB, b.discount)
          );
        });
        break;
      case "price_desc":
        list = list.slice().sort((a, b) => {
          const costA = typeof a.cost === "number" ? a.cost : 0;
          const costB = typeof b.cost === "number" ? b.cost : 0;
          return (
            discountedPrice(costB, b.discount) -
            discountedPrice(costA, a.discount)
          );
        });
        break;
      case "relevance":
      default:
        list = list.slice();
        break;
    }

    return list;
  }, [products, query, category, labelFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, category, labelFilter, sort, pageSize]);

  const containerClass =
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      : "flex flex-col gap-3";

  return (
    <section
      className="relative z-10 max-w-[92rem] xl:max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8"
      id="products"
    >
      <Breadcrumbs
        items={[
          { label: "Inicio", path: "/" },
          { label: "Productos", path: "/products" },
        ]}
      />

      <div className="mb-10 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold mb-2">
          Catálogo
        </p>
        <h1 className="text-4xl sm:text-5xl pt-4 pb-4 font-bold tracking-tight">
          Productos y piezas personalizadas en impresión 3D
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-slate-400">
          Explora referencias, piezas impresas y productos que puedes cotizar
          con Tesoluciona3D. Si necesitas una versión personalizada, cambios de
          material o una fabricación a medida en Cali, puedes ir directo a
          nuestro{" "}
          <Link
            to="/servicios/impresion-3d"
            className="text-amber-400 hover:text-amber-300"
          >
            servicio de impresión 3D
          </Link>
          .
        </p>
      </div>

      {/* Header / Controles */}
      <div className="flex items-end justify-between gap-6 flex-wrap mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl pt-4 pb-4 font-bold tracking-tight">
            Filtra y encuentra la referencia ideal
          </h2>
          <p className="text-sm opacity-70">
            {loading ? "Cargando..." : `${filtered.length} resultado(s)`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar (nombre, categoría, ID...)"
            className="w-full sm:w-64 rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 py-2 outline-none placeholder-white/50"
          />

          {/* Filtro de Categorías */}
          <div className="relative w-full sm:w-48">
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen((prev) => !prev);
                setIsLabelOpen(false);
                setIsSortOpen(false);
              }}
              className="w-full rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 py-2 text-left shadow-sm flex items-center justify-between outline-none"
            >
              <span className="truncate">{selectedCategoryLabel}</span>
              <span className="opacity-60 text-sm">▼</span>
            </button>

            {isCategoryOpen && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-lg overflow-hidden">
                {categories.map((c, index) => {
                  const label = c === "all" ? "Todas las categorías" : c;
                  const isActive = c === category;

                  return (
                    <button
                      key={`cat-${c}-${index}`}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-white hover:bg-white/10 transition ${
                        isActive ? "bg-white/15" : ""
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filtro de Etiquetas */}
          <div className="relative w-full sm:w-48">
            <button
              type="button"
              onClick={() => {
                setIsLabelOpen((prev) => !prev);
                setIsCategoryOpen(false);
                setIsSortOpen(false);
              }}
              className="w-full rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 py-2 text-left shadow-sm flex items-center justify-between outline-none"
            >
              <span className="truncate">{selectedLabelFilter}</span>
              <span className="opacity-60 text-sm">▼</span>
            </button>

            {isLabelOpen && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-lg overflow-hidden">
                {labels.map((l, index) => {
                  const label = l === "all" ? "Todas las etiquetas" : l;
                  const isActive = l === labelFilter;

                  return (
                    <button
                      key={`lbl-${l}-${index}`}
                      type="button"
                      onClick={() => {
                        setLabelFilter(l);
                        setIsLabelOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-white hover:bg-white/10 transition ${
                        isActive ? "bg-white/15" : ""
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filtro de Orden */}
          <div className="relative w-full sm:w-56">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsCategoryOpen(false);
                setIsLabelOpen(false);
              }}
              className="w-full rounded-xl border border-white/10 bg-[#0b1220] text-white px-3 py-2 text-left shadow-sm flex items-center justify-between outline-none"
            >
              <span className="truncate">{selectedSortLabel}</span>
              <span className="opacity-60 text-sm">▼</span>
            </button>

            {isSortOpen && (
              <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-md shadow-lg overflow-hidden">
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
                      className={`w-full px-3 py-2 text-left text-white hover:bg-white/10 transition ${
                        isActive ? "bg-white/15" : ""
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botones de Vista */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`rounded-xl px-3 py-2 border text-white ${
                view === "grid"
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
              type="button"
            >
              Cuadrícula
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-xl px-3 py-2 border text-white ${
                view === "list"
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 opacity-70 hover:opacity-100"
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
          <div className="rounded-2xl border border-white/10 bg-[#0b1220] text-white p-4">
            Cargando productos…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-[#0b1220] text-white p-4">
            <div className="font-semibold text-red-400">
              No se pudieron cargar los productos
            </div>
            <div className="text-sm opacity-80 mt-1">{error}</div>
            <button
              className="mt-3 rounded-xl border border-white/10 hover:bg-white/10 px-3 py-2 transition"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1220] text-white p-6 text-center opacity-80">
            No hay productos con esos filtros.
          </div>
        )}

        {/* Listado */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className={containerClass}>
              {paged.map((p) => (
                <React.Fragment key={p.id}>
                  <ProductCard
                    product={p}
                    view={view}
                    activeImg={activeImgById[p.id]}
                    onSelectImg={(url) =>
                      setActiveImgById((prev) => ({ ...prev, [p.id]: url }))
                    }
                  />
                </React.Fragment>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2 text-white">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-[#0b1220] hover:bg-white/10 px-3 py-2 disabled:opacity-50 transition"
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
                  className="rounded-xl border border-white/10 bg-[#0b1220] hover:bg-white/10 px-3 py-2 disabled:opacity-50 transition"
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
  const navigate = useNavigate();

  const imgs = getImages(p);
  const hasDiscount = clampDiscount(p.discount) > 0;
  const finalPrice =
    typeof p.cost === "number" ? discountedPrice(p.cost, p.discount) : 0;

  const wrapper =
    "relative rounded-2xl border border-white/10 bg-[#0b1220] text-white overflow-hidden transition-all hover:shadow-md";
  const bodyPadding = view === "grid" ? "p-4" : "p-4 sm:p-5";

  const hasLabel = p.TextLabel && p.TextLabel.trim() !== "";
  const badgeColor = p.color ? p.color : "rgba(0, 0, 0, 0.8)";

  return (
    <article className={wrapper}>
      {hasLabel && (
        <div
          className="absolute right-3 top-3 z-20 px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm backdrop-blur-sm"
          style={{ backgroundColor: badgeColor }}
        >
          {p.TextLabel}
        </div>
      )}

      <div className={view === "grid" ? "" : "sm:flex"}>
        <div className={view === "grid" ? "" : "sm:w-56 sm:shrink-0"}>
          <div className="relative aspect-[4/3] w-full bg-white/5">
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
              <div className="absolute left-3 top-3 z-10 rounded-full bg-black/80 text-white text-xs px-2 py-1">
                -{clampDiscount(p.discount)}%
              </div>
            )}
          </div>

          {imgs.length > 1 && (
            <div className="flex gap-2 p-3">
              {imgs.map((url, index) => (
                <button
                  type="button"
                  key={`${p.id}-${index}`}
                  onClick={() => onSelectImg(url)}
                  className={`h-12 w-12 rounded-xl overflow-hidden border ${
                    url === activeImg
                      ? "border-white/40"
                      : "border-white/10 opacity-70 hover:opacity-100"
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

        <div className={`flex-1 ${bodyPadding}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold leading-tight">{p.productName}</h3>
              <p className="text-xs opacity-70 mt-1">
                {p.category}{" "}
                {p.timeToDelivery
                  ? `• Tiempo de entrega: ${p.timeToDelivery}`
                  : ""}
              </p>
            </div>

            <span className="text-xs rounded-full border border-white/10 px-2 py-1 opacity-70">
              ID: {p.id}
            </span>
          </div>

          <p className="text-sm opacity-85 mt-3 line-clamp-3 text-slate-300">
            {p.description}
          </p>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <div className="text-sm opacity-70">Precio</div>
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-semibold text-white">
                  {typeof p.cost === "number" && p.cost > 0
                    ? formatCOP(finalPrice)
                    : !p.cost || p.cost === 0 || p.cost === "0"
                      ? "A cotizar"
                      : p.cost}
                </div>

                {hasDiscount && typeof p.cost === "number" && p.cost > 0 && (
                  <div className="text-sm line-through opacity-50">
                    {formatCOP(p.cost)}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl px-4 py-2 border border-white/20 hover:border-white/40 hover:bg-white/5 transition text-white"
              onClick={() => {
                navigate(`/producto/${p.id}`, { state: { product: p } });
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
