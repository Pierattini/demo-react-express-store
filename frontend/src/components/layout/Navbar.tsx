import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../context/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getSiteConfig } from "../../lib/site";
import type { SiteConfig } from "../../types/SiteConfig";
import { useTranslation } from "react-i18next";
import CartDrawer from "../cart/CartDrawer";
import Login from "../../pages/Login";

export default function Navbar() {

  const navigate = useNavigate();
  const { items } = useCart();
  const { user, token, logout } = useAuth();
  const { i18n, t } = useTranslation();

  const [site, setSite] = useState<SiteConfig | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const isLoggedIn = !!token;

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  useEffect(() => {
    const loadSite = async () => {
      const config = await getSiteConfig();
      setSite(config);
    };
    loadSite();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);

      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      setScrollProgress(height > 0 ? (y / height) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Barra progreso scroll */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-black z-[60]"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav
        className={`
          fixed top-0 w-full z-50
          transition-all duration-300
          ${scrolled ? "bg-white shadow-md" : "bg-white"}
          py-3 md:py-5
        `}
      >

        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-3 items-center">

          {/* IZQUIERDA */}
          <div className="flex items-center gap-3 md:gap-6 justify-start">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-xl hover:opacity-70 transition"
            >
              ☰
            </button>

            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-xl hover:opacity-70 transition"
              >
                🔍
              </button>

              {searchOpen && (
                <input
                  type="text"
                  placeholder={t("search")}
                  className="absolute top-8 left-0 px-3 py-1 border border-gray-300 rounded-md text-sm w-44 bg-white shadow"
                />
              )}
            </div>

          </div>

          {/* LOGO */}
          <div className="flex justify-center">
  {site?.logo ? (
    <img
      src={site.logo}
      alt={
        i18n.language === "en"
          ? site?.brand_name_en || site?.brand_name
          : site?.brand_name
      }
      className="h-8 md:h-20 max-w-[140px] object-contain"
    />
  ) : (
    <span className="font-semibold text-xl tracking-wide">
      {i18n.language === "en"
        ? site?.brand_name_en || site?.brand_name
        : site?.brand_name || "Meubles"}
    </span>
  )}
</div>

          {/* DERECHA */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* CARRITO */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-xl hover:opacity-70 transition"
            >
              🛒

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
                  {totalItems}
                </span>
              )}

            </button>

            {/* IDIOMA */}
            <div className="hidden md:flex gap-2 text-sm font-medium items-center">

              <button
                onClick={() => i18n.changeLanguage("es")}
                className={`${i18n.language === "es" ? "font-bold underline" : ""}`}
              >
                ES
              </button>

              <span>|</span>

              <button
                onClick={() => i18n.changeLanguage("en")}
                className={`${i18n.language === "en" ? "font-bold underline" : ""}`}
              >
                EN
              </button>

            </div>

           {isLoggedIn ? (
  <div className="flex items-center gap-4">

    {user?.role === "admin" && (
      <Link
        to="/admin"
        className="font-medium text-black hover:opacity-70 transition"
      >
        Admin
      </Link>
    )}

    <button
      onClick={handleLogout}
      className="font-medium hover:opacity-70 transition"
    >
      Cerrar sesión
    </button>

  </div>
) : (
  <button
    onClick={() => setLoginOpen(true)}
    className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
  >
    👤
  </button>
)}
          </div>

        </div>

      </nav>

      {/* MENU */}
      {/* MENU */}
{menuOpen && (
  <>
    {/* overlay para cerrar */}
    <div
      className="fixed inset-0 z-40"
      onClick={() => setMenuOpen(false)}
    />

    {/* menu */}
    <div
      className="
      absolute top-full left-4 mt-2
      bg-white/90 backdrop-blur-md
      shadow-xl shadow-black/10
      border border-gray-200
      rounded-xl
      z-40
      p-3
      flex flex-col
      gap-1
      min-w-[180px]
      animate-menu
      "
    >
      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="px-3 py-2 rounded-lg hover:bg-[#7c9a7c]/10 hover:text-[#7c9a7c] hover:translate-x-1 transition"
      >
        {t("home")}
      </Link>

      <Link
        to="/catalog"
        onClick={() => setMenuOpen(false)}
        className="px-3 py-2 rounded-lg hover:bg-[#7c9a7c]/10 hover:text-[#7c9a7c] hover:translate-x-1 transition"
      >
        {t("catalog")}
      </Link>

      <Link
        to="/contact"
        onClick={() => setMenuOpen(false)}
        className="px-3 py-2 rounded-lg hover:bg-[#7c9a7c]/10 hover:text-[#7c9a7c] hover:translate-x-1 transition"
      >
        {t("contact")}
      </Link>
    </div>
  </>
)}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setLoginOpen(false)}
          />

          <div className="relative bg-white rounded-xl shadow-xl w-[420px] p-6">
            <Login
              isModal
              onClose={() => setLoginOpen(false)}
            />
          </div>

        </div>
      )}

    </>
  );
}