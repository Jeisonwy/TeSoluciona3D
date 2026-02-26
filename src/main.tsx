import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

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
import Gate from "./components/Gate.tsx";
import Loader from "./components/Loader.tsx";
import Banner3D from "./components/banner3d.tsx";
import ProductDetails from "./components/ProductDetails.tsx";

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-rose-500/30">
      <div className="hidden md:block fixed inset-0 z-0 pointer-events-none">
        <InteractiveGlow intensity={0.16} size={900} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </div>
  );
}

function Landing() {
  return (
    <PageShell>
      <Main />
      <FloatingContactButton />
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

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename="/TeSoluciona3D">
      <Gate>
        <Loader>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/producto/:id" element={<ProductDetails />} />
          </Routes>
        </Loader>
      </Gate>
    </BrowserRouter>
  </StrictMode>,
);
