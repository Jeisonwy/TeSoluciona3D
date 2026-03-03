import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
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
import Products from "./components/Products.tsx";
import Promotions from "./components/Promotions.tsx";
import Loader from "./components/Loader.tsx";
import Banner3D from "./components/banner3d.tsx";
import ProductDetails from "./components/ProductDetails.tsx";
import PageTransition from "./components/PageTransition.tsx";
import AboutUs from "./components/AboutUs.tsx";

import ServiceImpresion3D from "./components/services/ServiceImpresion3D.tsx";
import ServiceLaser from "./components/services/ServiceLaser.tsx";
import ServiceMantenimiento from "./components/services/ServiceMantenimiento.tsx";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-rose-500/30">
      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none">
        <InteractiveGlow intensity={0.16} size={900} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />

        {/* 1. Botón global fuera de la animación */}
        <FloatingContactButton />

        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>

        <Footer />
      </div>
    </div>
  );
}

function Landing() {
  return (
    <PageShell>
      <Main />
      {/* 2. Promotions se queda aquí para no dañar el orden visual */}
      <Promotions />
      <InstagramFeed />
      <Banner3D />
      <Services />
    </PageShell>
  );
}

function ProductsPage() {
  return (
    <PageShell>
      <Products />
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell>
      <AboutUs />
    </PageShell>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Loader>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/producto/:id" element={<ProductDetails />} />
            <Route path="/nosotros" element={<AboutPage />} />

            <Route
              path="/servicios/impresion-3d"
              element={
                <PageShell>
                  <ServiceImpresion3D />
                </PageShell>
              }
            />
            <Route
              path="/servicios/laser"
              element={
                <PageShell>
                  <ServiceLaser />
                </PageShell>
              }
            />
            <Route
              path="/servicios/mantenimiento"
              element={
                <PageShell>
                  <ServiceMantenimiento />
                </PageShell>
              }
            />
          </Routes>
        </Loader>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
