import React, { StrictMode, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import ScrollToTop from "./components/ScrollToTop.tsx";
import Main from "./components/Main.tsx";
import "./index.css";
import Footer from "./components/Footer.tsx";
import Navbar from "./components/Navbar.tsx";
import FloatingContactButton from "./components/FloatingContactButton.tsx";
import InstagramFeed from "./components/InstagramFeed.tsx";
import Services from "./components/Services.tsx";
import InteractiveGlow from "./components/InteractiveGlow.tsx";
import Loader from "./components/Loader.tsx";
import Banner3D from "./components/banner3d.tsx";
import PageTransition from "./components/PageTransition.tsx";
import { Seo } from "./components/seo/Seo.tsx";
import {
  buildCanonical,
  getLocalBusinessSchema,
  getOrganizationSchema,
} from "./lib/siteConfig.ts";

import AdminProducts from "./components/admin/pages/AdminProducts.tsx";
import AdminCreateProduct from "./components/admin/pages/AdminCreateProduct.tsx";
import AdminDashboard from "./components/admin/pages/AdminDashboard.tsx";
import AdminLogin from "./components/admin/pages/AdminLogin.tsx";
import ProtectedAdminRoute from "./components/admin/components/ProtectedAdminRoute.tsx";

const AdminLandingImages = lazy(
  () => import("./components/admin/pages/AdminLandingImages"),
);
const Products = lazy(() => import("./components/Products.tsx"));
const ProductDetails = lazy(() => import("./components/ProductDetails.tsx"));
const Promotions = lazy(() => import("./components/Promotions.tsx"));
const AboutUs = lazy(() => import("./components/AboutUs.tsx"));
const ServiceImpresion3D = lazy(
  () => import("./components/services/ServiceImpresion3D.tsx"),
);
const ServiceLaser = lazy(
  () => import("./components/services/ServiceLaser.tsx"),
);
const ServiceMantenimiento = lazy(
  () => import("./components/services/ServiceMantenimiento.tsx"),
);

type PageShellProps = {
  children: React.ReactNode;
};

function PageShell({ children }: PageShellProps) {
  return (
    <div
      translate="no"
      className="notranslate relative min-h-screen bg-zinc-950 text-white selection:bg-rose-500/30"
    >
      <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
        <InteractiveGlow intensity={0.16} size={900} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden">
        <div className="border-b border-amber-500/10 bg-amber-500/10 px-4 py-2 text-center text-xs font-medium text-amber-100 sm:px-6">
          Esta página no es compatible con la traducción automática del
          navegador. Úsala en español para evitar errores.
        </div>
        <Navbar />
        <FloatingContactButton />

        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>

        <Footer />
      </div>
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-[92rem] items-center justify-center px-4 text-center text-slate-400">
      Cargando página...
    </div>
  );
}

function getServiceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    areaServed: {
      "@type": "City",
      name: "Cali",
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Tesoluciona3D",
    },
    url: buildCanonical(path),
  };
}

function Landing() {
  return (
    <PageShell>
      <Seo
        title="Impresión 3D en Cali | Prototipos y piezas personalizadas | Tesoluciona3D"
        description="Tesoluciona3D ofrece impresión 3D en Cali, prototipado, repuestos, piezas personalizadas y soluciones a medida para clientes particulares y empresas."
        path="/"
        schema={[getLocalBusinessSchema(), getOrganizationSchema()]}
      />

      <Main />
      <Suspense fallback={<RouteFallback />}>
        <Promotions />
      </Suspense>
      <InstagramFeed />
      <Banner3D />
      <Services />
    </PageShell>
  );
}

function ProductsPage() {
  return (
    <PageShell>
      <Seo
        title="Catálogo de impresión 3D | Tesoluciona3D"
        description="Explora el catálogo de productos, piezas y referencias impresas en 3D de Tesoluciona3D y solicita una cotización personalizada en Cali."
        path="/products"
      />
      <Products />
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell>
      <Seo
        title="Nosotros | Tesoluciona3D en Cali"
        description="Conoce a Tesoluciona3D, empresa enfocada en impresión 3D, prototipado y soluciones personalizadas en Cali, Valle del Cauca."
        path="/nosotros"
      />
      <AboutUs />
    </PageShell>
  );
}

function ServiceImpresion3DPage() {
  return (
    <PageShell>
      <Seo
        title="Servicio de impresión 3D en Cali | Tesoluciona3D"
        description="Cotiza impresión 3D en Cali con Tesoluciona3D. Fabricamos prototipos, repuestos y piezas personalizadas con asesoría técnica."
        path="/servicios/impresion-3d"
        schema={getServiceSchema(
          "Servicio de impresión 3D en Cali",
          "Fabricación de prototipos, repuestos y piezas personalizadas con impresión 3D.",
          "/servicios/impresion-3d",
        )}
      />
      <ServiceImpresion3D />
    </PageShell>
  );
}

function ServiceLaserPage() {
  return (
    <PageShell>
      <Seo
        title="Corte y grabado láser en Cali | Tesoluciona3D"
        description="Servicio de corte y grabado láser en Cali para señalética, decoración y piezas personalizadas con acabado profesional."
        path="/servicios/laser"
        schema={getServiceSchema(
          "Corte y grabado láser en Cali",
          "Servicio de corte y grabado láser para proyectos comerciales y personalizados.",
          "/servicios/laser",
        )}
      />
      <ServiceLaser />
    </PageShell>
  );
}

function ServiceMantenimientoPage() {
  return (
    <PageShell>
      <Seo
        title="Mantenimiento de impresoras 3D en Cali | Tesoluciona3D"
        description="Diagnóstico, calibración y reparación de impresoras 3D en Cali para recuperar la estabilidad y la calidad de impresión."
        path="/servicios/mantenimiento"
        schema={getServiceSchema(
          "Mantenimiento de impresoras 3D en Cali",
          "Servicio técnico para diagnóstico, calibración y reparación de impresoras 3D.",
          "/servicios/mantenimiento",
        )}
      />
      <ServiceMantenimiento />
    </PageShell>
  );
}

function restoreSpaRedirect() {
  if (typeof window === "undefined") return;

  const redirect = window.sessionStorage.getItem("teso-spa-redirect");
  if (!redirect) return;

  window.sessionStorage.removeItem("teso-spa-redirect");
  window.history.replaceState(null, "", redirect);
}

restoreSpaRedirect();

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Loader>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Públicas */}
              <Route path="/" element={<Landing />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/producto/:id" element={<ProductDetails />} />
              <Route path="/nosotros" element={<AboutPage />} />
              <Route
                path="/servicios/impresion-3d"
                element={<ServiceImpresion3DPage />}
              />
              <Route path="/servicios/laser" element={<ServiceLaserPage />} />
              <Route
                path="/servicios/mantenimiento"
                element={<ServiceMantenimientoPage />}
              />

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <ProtectedAdminRoute>
                    <AdminProducts />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/create-product"
                element={
                  <ProtectedAdminRoute>
                    <AdminCreateProduct />
                  </ProtectedAdminRoute>
                }
              />

              <Route
                path="/admin/landing"
                element={
                  <ProtectedAdminRoute>
                    <AdminLandingImages />
                  </ProtectedAdminRoute>
                }
              />
            </Routes>
          </Suspense>
        </Loader>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
