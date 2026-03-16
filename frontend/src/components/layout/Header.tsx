import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useSiteConfig } from "../../hooks/useSiteConfig";
import { useState } from "react";
import CartDrawer from "../cart/CartDrawer";
import Login from "../../pages/Login";
import RegisterForm from "../auth/RegisterForm";

export default function Header() {

  const { items } = useCart();
  const { site } = useSiteConfig();
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >

        {/* Logo */}
        <Link 
  to="/" 
  style={{ 
    fontWeight: 700, 
    fontSize: 28, 
    display: "flex",
    alignItems: "center",
    gap: 8
  }}
>
  🏠 {site?.brand_name || "MiTienda"}
</Link>

        {/* Navegación */}
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>

          <Link to="/catalog">Catálogo</Link>

          {/* CARRITO */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer"
            }}
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: "#111",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "2px 8px",
                  fontSize: 12,
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {!token ? (
            <>
              {/* LOGIN MODAL */}
              <button
                onClick={() => setLoginOpen(true)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer"
                }}
              >
                Login
              </button>

              <button
  onClick={() => setRegisterOpen(true)}
  style={{
    border: "none",
    background: "transparent",
    cursor: "pointer"
  }}
>
  Registro
</button>
            </>
          ) : (
            <>
              <Link to="/profile">
                {user?.name ?? "Perfil"}
              </Link>

              <button
                onClick={logout}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#c00",
                }}
              >
                Logout
              </button>
            </>
          )}

        </nav>

      </header>

      {/* CART DRAWER */}
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
{/* REGISTER MODAL */}
{registerOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setRegisterOpen(false)}
    />

    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-8">
      <RegisterForm />
    </div>

  </div>
)}
    </>
  );
}