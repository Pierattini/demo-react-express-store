import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Navbar from "./Navbar";
import PromoModal from "../ui/PromoModal";
import WhatsAppButton from "../ui/WhatsAppButton";
import Footer from "./Footer";
import ChatWidget from "../chat/ChatWidget";

export default function PageLayout() {

  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const effectRan = useRef(false);
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const alreadyShown = sessionStorage.getItem("promo_shown");

    if (isHome && !isAuthenticated && !alreadyShown) {
      setTimeout(() => setShowPromo(true), 0);
      sessionStorage.setItem("promo_shown", "true");
    }
  }, [isHome, isAuthenticated]);

  return (
    <div className={isHome ? "min-h-screen" : "min-h-screen bg-[#f6f2ea]"}>

      <Navbar />

      {showPromo && (
        <PromoModal onClose={() => setShowPromo(false)} />
      )}

      <main className={isHome ? "" : "pt-28"}>
        <Outlet
          context={{
            openPromo: () => {
              if (sessionStorage.getItem("promo_shown")) return;
              sessionStorage.setItem("promo_shown", "true");
              setShowPromo(true);
            },
          }}
        />
      </main>

      <Footer />
      <ChatWidget />
      <WhatsAppButton />

    </div>
  );
}