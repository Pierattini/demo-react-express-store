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
  const [langOpen, setLangOpen] = useState(false);

  const LANGUAGES = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
    { code: "pt", label: "Português" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
  ];

  const isLoggedIn = !!token;

  const totalItems = useMemo(
  () => (items || []).reduce((sum, item) => sum + item.quantity, 0),
  [items]
);

  useEffect(() => {
  const loadSite = async () => {
    try {
      const config = await getSiteConfig();
      setSite(config);
    } catch {
      setSite(null);
    }
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
          ${scrolled ? "bg-white shadow-lg" : "bg-white"}
          h-[88px] md:h-[96px]
        `}
      >

        <div className="relative w-full h-full px-1 md:px-6 grid grid-cols-[1fr_auto_1fr] items-center">
          {/* IZQUIERDA */}
          <div className="relative flex items-center gap-3 md:gap-6 justify-start">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col justify-center items-center w-9 h-9 gap-[5px] hover:opacity-70 transition rounded-md"
              aria-label="Menú"
            >
              <span className={`block h-[2px] bg-gray-800 transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5'}`} />
              <span className={`block h-[2px] bg-gray-800 transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-4'}`} />
              <span className={`block h-[2px] bg-gray-800 transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-5'}`} />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-xl hover:opacity-70 transition"
              >
                🔍
              </button>

              {searchOpen && (
                <input
                  autoFocus
                  type="text"
                  placeholder={t("search")}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm w-44 bg-white shadow"
                />
              )}
            </div>

          </div>


          {/* LOGO */}
          <div className="flex justify-center">
  {site?.logo ? (
    <div className="flex h-[64px] md:h-[74px] items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <img
        src={site.logo}
        alt={
          i18n.language === "en"
            ? site?.brand_name_en || site?.brand_name
            : site?.brand_name
        }
        className="h-full w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)] scale-[1.2] md:scale-[1.28]"
      />
    </div>
  ) : (
    <span className="font-bold text-2xl md:text-3xl tracking-wide text-gray-900 transition-all duration-300 hover:text-[#6b896b] cursor-default">
      {i18n.language === "en"
        ? site?.brand_name_en || site?.brand_name
        : site?.brand_name || "Muebles"}
    </span>
  )}
</div>
          {/* DERECHA */}
          <div className="flex items-center gap-2 md:gap-6 justify-end">

            {/* IDIOMA */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-semibold text-gray-700 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                {i18n.language.toUpperCase()}
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                          i18n.language === lang.code
                            ? "bg-gray-50 font-semibold text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

           {isLoggedIn ? (
  <div className="flex items-center gap-3 sm:gap-4">

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
      className="font-medium hover:opacity-70 transition whitespace-nowrap"
    >
      Cerrar
    </button>

    {/* 🛒 MOVIDO AQUÍ */}
    <button
      onClick={() => setCartOpen(true)}
      className="relative text-xl hover:opacity-70 transition ml-2 mr-1"
    >
      🛒

      {totalItems > 0 && (
        <span className="absolute -top-2 -right-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] font-semibold text-white">
          {totalItems}
        </span>
      )}
    </button>

  </div>
) : (
  <div className="flex items-center gap-2">

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

    <button
      onClick={() => setLoginOpen(true)}
      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
    >
      👤
    </button>

  </div>
)}
          </div>

        </div>

      </nav>
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
      className="fixed top-[88px] md:top-[96px] left-6 w-[220px] bg-white/95 backdrop-blur-md shadow-2xl shadow-black/15 border border-gray-100 rounded-2xl z-40 p-2 flex flex-col gap-0.5 animate-menu"
    >
      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#7c9a7c]/10 hover:text-[#5a7a5a] hover:translate-x-1 transition-all duration-200"
      >
        <span className="text-base">🏠</span>
        {t("home")}
      </Link>

      <Link
        to="/catalog"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#7c9a7c]/10 hover:text-[#5a7a5a] hover:translate-x-1 transition-all duration-200"
      >
        <span className="text-base">🛋️</span>
        {t("catalog")}
      </Link>

      <Link
        to="/contact"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-[#7c9a7c]/10 hover:text-[#5a7a5a] hover:translate-x-1 transition-all duration-200"
      >
        <span className="text-base">✉️</span>
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