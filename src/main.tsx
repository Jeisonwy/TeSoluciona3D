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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Gate>
      <Loader>
        <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-rose-500/30">
          <div className="hidden md:block fixed inset-0 z-0 pointer-events-none">
            <InteractiveGlow intensity={0.16} size={900} />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
            <Navbar />
            <Main />
            <FloatingContactButton />
            <InstagramFeed />
            <Services />
            <Products />
            <Promotions />
            <Footer />
          </div>
        </div>
      </Loader>
    </Gate>
  </StrictMode>,
);
