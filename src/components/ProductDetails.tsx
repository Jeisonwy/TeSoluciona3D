import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Product } from "./Products";
import Breadcrumbs from "./seo/Breadcrumbs";
import { Seo } from "./seo/Seo";

const PRODUCTS_ENDPOINT = "https://tesoluciona3d.com/api/get_products.php";

export type ProductLookupResult = {
  product: Product | null;
  products: Product[];
};

function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `https://tesoluciona3d.com${url}`;
  return `https://tesoluciona3d.com/${url}`;
}

function normalizeProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item) => {
    const product = item as Product;
    return {
      ...product,
      cost: Number(product.cost) || 0,
      discount: Number(product.discount) || 0,
      image_url: product.image_url || "",
      images: Array.isArray(product.images) ? product.images : [],
    };
  });
}

function getProductImages(product: Product | null): string[] {
  if (!product) return [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images
      .map((img) => normalizeImageUrl(img.image_url))
      .filter(Boolean);
  }

  if (product.image_url) {
    return [normalizeImageUrl(product.image_url)];
  }

  return [];
}

function findProductInSession(productId: string): ProductLookupResult {
  const cacheKey = `products_cache_${PRODUCTS_ENDPOINT}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (!cachedData) return { product: null, products: [] };

  const products = normalizeProducts(JSON.parse(cachedData));
  const product =
    products.find((item) => String(item.id) === String(productId)) || null;

  return { product, products };
}

async function fetchProductById(
  productId: string,
): Promise<ProductLookupResult> {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }

  const json = (await response.json()) as {
    success?: boolean;
    data?: unknown;
  };

  if (!json.success) {
    return { product: null, products: [] };
  }

  const products = normalizeProducts(json.data);
  sessionStorage.setItem(
    `products_cache_${PRODUCTS_ENDPOINT}`,
    JSON.stringify(products),
  );

  return {
    product:
      products.find((item) => String(item.id) === String(productId)) || null,
    products,
  };
}

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

/* ─── Background component ─────────────────────────────────────────────── */
function SpaceBg() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const ref = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.4 + 0.8,
        duration: Math.random() * 9 + 5,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.07,
      })),
    [],
  );

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const dx = (mousePos.x - 50) / 50;
  const dy = (mousePos.y - 50) / 50;

  return (
    <>
      <style>{`
        .spbg-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .spbg-scanline {
          background: linear-gradient(90deg, transparent, rgba(255,106,0,0.55), transparent);
          animation: spbg-scan 5s ease-in-out infinite;
        }
        @keyframes spbg-scan {
          0%   { top: 0%;   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .spbg-float {
          animation-name: spbg-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes spbg-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-22px) scale(1.18); }
        }
        .spbg-ring { position:absolute; border-radius:50%; border:1px solid; }
        .spbg-r1 { animation: spbg-spin 11s linear infinite; }
        .spbg-r2 { animation: spbg-spin 16s linear infinite; border-style:dashed; }
        .spbg-r3 { animation: spbg-spinr 22s linear infinite; }
        @keyframes spbg-spin { to { transform: rotate(360deg); } }
        @keyframes spbg-spinr { to { transform: rotate(-360deg); } }
        .spbg-orbit {
          position:absolute; border-radius:50%;
          animation: spbg-spin 9s linear infinite;
          transform-origin: 0 0;
        }
        @keyframes spbg-pulse {
          0%,100% { box-shadow:0 0 18px rgba(255,106,0,0.22); }
          50% { box-shadow:0 0 52px rgba(255,106,0,0.55); }
        }
      `}</style>

      <div
        ref={ref}
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#060608]"
      >
        <div className="spbg-grid absolute inset-0" />

        <div
          className="absolute -left-40 -top-40 h-[640px] w-[640px] rounded-full blur-[110px]"
          style={{
            transform: `translate(${dx * 16}px, ${dy * 11}px)`,
            background:
              "radial-gradient(circle, rgba(255,106,0,0.17) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full blur-[100px]"
          style={{
            transform: `translate(${-dx * 13}px, ${-dy * 9}px)`,
            background:
              "radial-gradient(circle, rgba(238,9,121,0.13) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,170,255,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-20 right-1/4 h-[320px] w-[320px] rounded-full blur-[90px]"
          style={{
            transform: `translate(${dx * 8}px, ${dy * 6}px)`,
            background:
              "radial-gradient(circle, rgba(155,89,182,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="spbg-scanline absolute left-0 top-0 h-[2px] w-full" />

        {particles.map((p) => (
          <span
            key={p.id}
            className="spbg-float absolute rounded-full bg-[#ff6a00]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        <div
          className="absolute bottom-[-60px] right-[-60px] h-[380px] w-[380px]"
          style={{
            transform: `translate(${-dx * 6}px, ${-dy * 4}px)`,
            opacity: 0.55,
          }}
        >
          <div
            className="spbg-ring spbg-r1 absolute inset-0"
            style={{ borderColor: "rgba(255,106,0,0.3)" }}
          />
          <div
            className="spbg-ring spbg-r2 absolute -inset-10"
            style={{ borderColor: "rgba(238,9,121,0.2)" }}
          />
          <div
            className="spbg-ring spbg-r3 absolute -inset-20"
            style={{ borderColor: "rgba(155,89,182,0.12)" }}
          />
          <div
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[#ff6a00]/40 bg-gradient-to-br from-[#ff6a00]/20 to-[#ee0979]/10"
            style={{
              clipPath:
                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
              animation: "spbg-pulse 3s ease-in-out infinite",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff6a00"
              strokeWidth="1.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {[0, 120, 240].map((deg) => (
            <span
              key={deg}
              className="spbg-orbit absolute left-1/2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  deg === 0 ? "#ff6a00" : deg === 120 ? "#ee0979" : "#9b59b6",
                boxShadow: `0 0 10px currentColor`,
                transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
              }}
            />
          ))}
        </div>

        <div
          className="absolute -left-20 -top-20 h-[260px] w-[260px]"
          style={{
            transform: `translate(${dx * 5}px, ${dy * 3}px)`,
            opacity: 0.35,
          }}
        >
          <div
            className="spbg-ring spbg-r1 absolute inset-0"
            style={{ borderColor: "rgba(255,106,0,0.25)" }}
          />
          <div
            className="spbg-ring spbg-r3 absolute -inset-8"
            style={{ borderColor: "rgba(155,89,182,0.15)" }}
          />
        </div>
      </div>
    </>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const stateProduct = location.state?.product as Product | undefined;

  const [product, setProduct] = useState<Product | null>(
    stateProduct ? normalizeProducts([stateProduct])[0] : null,
  );
  const [lookupState, setLookupState] = useState<
    "loading" | "ready" | "not_found"
  >(stateProduct ? "ready" : "loading");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState<string>("");

  const whatsappNumber = "573177248656";

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    quantity: 1,
    comments: "",
  });

  const imgs = useMemo(() => getProductImages(product), [product]);

  useEffect(() => {
    let alive = true;

    async function resolveProduct() {
      if (!id) {
        if (!alive) return;
        setProduct(null);
        setLookupState("not_found");
        return;
      }

      if (stateProduct && String(stateProduct.id) === String(id)) {
        const normalizedStateProduct =
          normalizeProducts([stateProduct])[0] || null;

        const hasImages =
          !!normalizedStateProduct?.image_url ||
          (Array.isArray(normalizedStateProduct?.images) &&
            normalizedStateProduct.images.length > 0);

        if (hasImages) {
          if (!alive) return;
          setProduct(normalizedStateProduct);
          setLookupState("ready");
          return;
        }
      }

      if (typeof window === "undefined") return;

      setLookupState("loading");

      try {
        const fromSession = findProductInSession(id);
        if (fromSession.product) {
          if (!alive) return;
          setProduct(fromSession.product);
          setLookupState("ready");
          return;
        }

        const fromApi = await fetchProductById(id);
        if (!alive) return;

        setProduct(fromApi.product);
        setLookupState(fromApi.product ? "ready" : "not_found");
      } catch {
        if (!alive) return;
        setProduct(null);
        setLookupState("not_found");
      }
    }

    resolveProduct();

    return () => {
      alive = false;
    };
  }, [id, stateProduct]);

  useEffect(() => {
    if (!product) return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImg(imgs[0] || "");
    setFormData((prev) => ({ ...prev, quantity: 1, comments: "" }));
  }, [product?.id, imgs.length]);

  useEffect(() => {
    let alive = true;

    async function resolveRelatedProducts() {
      if (!product) return;

      const cacheKey = `products_cache_${PRODUCTS_ENDPOINT}`;
      let allProducts: Product[] = [];

      try {
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          allProducts = normalizeProducts(JSON.parse(cachedData));
        } else {
          const response = await fetch(PRODUCTS_ENDPOINT, {
            method: "GET",
            headers: { Accept: "application/json" },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
          }

          const json = (await response.json()) as {
            success?: boolean;
            data?: unknown;
          };

          if (!json.success) {
            if (!alive) return;
            setRelatedProducts([]);
            return;
          }

          allProducts = normalizeProducts(json.data);
          sessionStorage.setItem(cacheKey, JSON.stringify(allProducts));
        }

        let related = allProducts.filter(
          (p) =>
            String(p.category) === String(product.category) &&
            String(p.id) !== String(product.id),
        );

        if (related.length < 4) {
          const others = allProducts.filter(
            (p) =>
              String(p.category) !== String(product.category) &&
              String(p.id) !== String(product.id),
          );
          related = [...related, ...others];
        }

        if (!alive) return;
        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error("Error cargando productos relacionados:", error);
        if (!alive) return;
        setRelatedProducts([]);
      }
    }

    resolveRelatedProducts();

    return () => {
      alive = false;
    };
  }, [product]);

  if (lookupState === "loading") {
    return (
      <>
        <SpaceBg />
        <Seo
          title="Producto | Tesoluciona3D"
          description="Cargando detalle del producto en Tesoluciona3D."
          path={id ? `/producto/${id}` : "/products"}
          robots="noindex,follow"
        />
        <div className="min-h-screen text-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <Breadcrumbs
              items={[
                { label: "Inicio", path: "/" },
                { label: "Productos", path: "/products" },
                { label: "Cargando producto" },
              ]}
            />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              Cargando detalle del producto...
            </div>
          </div>
        </div>
      </>
    );
  }
  if (!product) {
    return (
      <>
        <SpaceBg />
        <Seo
          title="Producto no disponible | Tesoluciona3D"
          description="No encontramos ese producto. Explora el catálogo o solicita una cotización personalizada."
          path={id ? `/producto/${id}` : "/products"}
          robots="noindex,follow"
        />
        <div className="min-h-screen text-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <Breadcrumbs
              items={[
                { label: "Inicio", path: "/" },
                { label: "Productos", path: "/products" },
                { label: "Producto no disponible" },
              ]}
            />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h1 className="text-2xl font-bold text-white">
                Este producto no está disponible en este momento
              </h1>
              <p className="mt-4 text-slate-400">
                Puedes volver al catálogo o escribirnos para cotizar una pieza
                personalizada.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="rounded-xl border border-white/10 px-5 py-3 hover:border-white/20"
                >
                  Volver al catálogo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      "https://wa.me/573177248656?text=Hola,%20quiero%20cotizar%20una%20pieza%20personalizada.",
                      "_blank",
                    )
                  }
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
                >
                  Cotizar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const finalPrice = discountedPrice(
    Number(product.cost) || 0,
    Number(product.discount) || 0,
  );
  const hasDiscount = clampDiscount(Number(product.discount) || 0) > 0;

  const handleQuote = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `👋 Hola, me interesa cotizar un producto:

*Producto:* ${product.productName} (ID: ${product.id})
*Cantidad:* ${formData.quantity}
*Precio Unitario:* ${formatCOP(finalPrice)}

*Mis datos:*
👤 *Nombre:* ${formData.name}
📍 *Ciudad:* ${formData.city}
💬 *Comentarios:* ${formData.comments ? formData.comments : "Ninguno"}

¿Me podrías confirmar disponibilidad y costo de envío?`;

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <>
      <SpaceBg />
      <Seo
        title={`${product.productName} | Tesoluciona3D`}
        description={
          product.description ||
          "Consulta el detalle de este producto y solicita una cotización personalizada."
        }
        path={`/producto/${product.id}`}
        robots="noindex,follow"
      />

      <style>{`
        .card-corner { position:absolute; width:14px; height:14px; pointer-events:none; }
        .cc-tl { top:12px; left:12px; border-top:2px solid rgba(255,106,0,0.4); border-left:2px solid rgba(255,106,0,0.4); }
        .cc-tr { top:12px; right:12px; border-top:2px solid rgba(255,106,0,0.4); border-right:2px solid rgba(255,106,0,0.4); }
        .cc-bl { bottom:12px; left:12px; border-bottom:2px solid rgba(255,106,0,0.4); border-left:2px solid rgba(255,106,0,0.4); }
        .cc-br { bottom:12px; right:12px; border-bottom:2px solid rgba(255,106,0,0.4); border-right:2px solid rgba(255,106,0,0.4); }

        .pd-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .pd-input::placeholder { color: rgba(255,255,255,0.3); }
        .pd-input:focus { border-color: rgba(255,106,0,0.55); }

        .pd-label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 6px; letter-spacing: 0.04em; }

        .pd-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          overflow: hidden;
        }
        .pd-card::before {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,106,0,0.04) 0%, transparent 50%);
          pointer-events:none;
        }
        .pd-thumb-active { border-color: #ff6a00 !important; }
        .pd-related-card {
          cursor:pointer;
          border-radius:16px;
          border:1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          overflow:hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .pd-related-card:hover { border-color: rgba(255,106,0,0.45); transform: translateY(-3px); }

        .pd-btn-wsp {
          width:100%;
          background: linear-gradient(135deg,#25d366,#128c7e);
          color:#fff;
          font-weight:700;
          padding:13px 20px;
          border-radius:12px;
          border:none;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-size:15px;
          transition: filter 0.2s, transform 0.2s;
        }
        .pd-btn-wsp:hover { filter:brightness(1.12); transform:translateY(-1px); }

        .pd-price {
          font-size:38px; font-weight:800; line-height:1;
          background: linear-gradient(135deg, #ff6a00, #ee0979);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .pd-discount-badge {
          display:inline-flex; align-items:center;
          background:rgba(255,106,0,0.15);
          border:1px solid rgba(255,106,0,0.3);
          color:#ff6a00;
          font-size:11px; font-weight:700;
          padding:3px 10px; border-radius:4px;
          letter-spacing:.05em;
        }
        .pd-category-tag {
          display:inline-flex; align-items:center; gap:6px;
          font-size:11px; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
          color:#ff6a00;
          background:rgba(255,106,0,0.1);
          border:1px solid rgba(255,106,0,0.25);
          padding:4px 12px; border-radius:3px;
        }
        .pd-back-btn {
          display:inline-flex; align-items:center; gap:8px;
          color:rgba(255,255,255,0.5);
          font-size:13px; font-weight:500; letter-spacing:.04em;
          background: rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          padding:8px 16px; border-radius:8px;
          transition: all 0.2s; border:none; cursor:pointer;
        }
        .pd-back-btn:hover { color:#fff; background:rgba(255,255,255,0.09); }

        .pd-form-box {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:16px;
          padding:24px;
          margin-top:auto;
          position:relative;
        }
        .pd-form-box::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,106,0,0.4),transparent);
        }
      `}</style>

      <div className="min-h-screen text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Breadcrumbs
            items={[
              { label: "Inicio", path: "/" },
              { label: "Productos", path: "/products" },
              { label: product.productName, path: `/producto/${product.id}` },
            ]}
          />

          <button
            onClick={() => navigate("/products")}
            className="pd-back-btn mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver a productos
          </button>

          <div className="pd-card mb-14 p-6 sm:p-10">
            <span className="card-corner cc-tl" />
            <span className="card-corner cc-tr" />
            <span className="card-corner cc-bl" />
            <span className="card-corner cc-br" />

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div
                  className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/8"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  {activeImg ? (
                    <img
                      src={activeImg}
                      alt={product.productName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm opacity-40">
                      Sin imagen
                    </div>
                  )}
                  <span className="card-corner cc-tl" />
                  <span className="card-corner cc-tr" />
                  <span className="card-corner cc-bl" />
                  <span className="card-corner cc-br" />
                </div>

                {imgs.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {imgs.map((url, i) => (
                      <button
                        key={`${url}-${i}`}
                        type="button"
                        onClick={() => setActiveImg(url)}
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          activeImg === url
                            ? "pd-thumb-active"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <img
                          src={url}
                          className="h-full w-full object-cover"
                          alt={`${product.productName} ${i + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="pd-category-tag">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff6a00]" />
                      {product.category}
                    </span>
                    <span className="text-[11px] text-white/30 tracking-wider">
                      ID: {product.id}
                    </span>
                  </div>

                  <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                    {product.productName}
                  </h1>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <span className="pd-price">{formatCOP(finalPrice)}</span>
                  {hasDiscount && (
                    <>
                      <span className="mb-1 text-lg font-medium text-white/35 line-through">
                        {formatCOP(Number(product.cost) || 0)}
                      </span>
                      <span className="pd-discount-badge">
                        -{clampDiscount(Number(product.discount) || 0)}%
                      </span>
                    </>
                  )}
                </div>

                <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">
                  {product.description}
                </p>

                <form
                  onSubmit={handleQuote}
                  className="pd-form-box flex flex-col gap-4"
                >
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff6a00"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    Solicitar Cotización
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="pd-label">Tu Nombre</p>
                      <input
                        type="text"
                        className="pd-input"
                        placeholder="Ej. Juan Pérez"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <p className="pd-label">Ciudad</p>
                      <input
                        type="text"
                        className="pd-input"
                        placeholder="Ej. Bogotá"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <p className="pd-label">Cantidad *</p>
                    <input
                      required
                      type="number"
                      min="1"
                      className="pd-input"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: parseInt(e.target.value, 10) || 1,
                        })
                      }
                    />
                  </div>

                  <div>
                    <p className="pd-label">Comentarios (Opcional)</p>
                    <textarea
                      rows={2}
                      className="pd-input resize-none"
                      placeholder="Color, talla, dudas sobre envío..."
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({ ...formData, comments: e.target.value })
                      }
                    />
                  </div>

                  <button type="submit" className="pd-btn-wsp">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M11.99 2C6.465 2 2 6.465 2 11.99c0 1.88.516 3.637 1.41 5.14L2 22l4.98-1.39C8.37 21.49 10.13 22 11.99 22c5.525 0 9.99-4.465 9.99-9.99C21.98 6.465 17.515 2 11.99 2zm0 18.19c-1.71 0-3.296-.465-4.656-1.273l-.334-.198-3.46.964.979-3.382-.216-.348A7.95 7.95 0 014.01 11.99C4.01 7.567 7.567 4.01 11.99 4.01c4.422 0 7.98 3.557 7.98 7.98 0 4.422-3.558 7.98-7.98 7.98z" />
                    </svg>
                    Comprar por WhatsApp
                  </button>
                </form>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/8" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/40">
                  También te puede interesar
                </h2>
                <span className="h-px flex-1 bg-white/8" />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {relatedProducts.map((p) => {
                  const pHasDiscount =
                    clampDiscount(Number(p.discount) || 0) > 0;
                  const pFinal = discountedPrice(
                    Number(p.cost) || 0,
                    Number(p.discount) || 0,
                  );

                  const relatedImage =
                    Array.isArray(p.images) && p.images.length > 0
                      ? normalizeImageUrl(p.images[0].image_url)
                      : p.image_url
                        ? normalizeImageUrl(p.image_url)
                        : "";

                  return (
                    <div
                      key={p.id}
                      className="pd-related-card"
                      onClick={() =>
                        navigate(`/producto/${p.id}`, { state: { product: p } })
                      }
                    >
                      <div
                        className="relative aspect-square"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                      >
                        {relatedImage ? (
                          <img
                            src={relatedImage}
                            alt={p.productName}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs opacity-40">
                            Sin imagen
                          </div>
                        )}

                        {pHasDiscount && (
                          <span className="absolute left-2 top-2 rounded-sm bg-[#ff6a00]/90 px-2 py-0.5 text-[10px] font-bold text-white">
                            -{clampDiscount(Number(p.discount) || 0)}%
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-white/85">
                          {p.productName}
                        </p>
                        <span
                          className="text-base font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg,#ff6a00,#ee0979)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {formatCOP(pFinal)}
                        </span>
                        {pHasDiscount && (
                          <span className="ml-2 text-xs text-white/30 line-through">
                            {formatCOP(Number(p.cost) || 0)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
