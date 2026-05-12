import { useState } from "react";
import RegisterForm from "../auth/RegisterForm";
import LoginForm from "../auth/LoginForm";

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: 40,
  borderRadius: 18,
  width: "100%",
  maxWidth: 600,
  position: "relative",
  boxShadow: "0 25px 80px rgba(0,0,0,0.30)",
};

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  border: "1px solid #e5e7eb",
  background: "white",
  fontSize: 18,
  cursor: "pointer",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s",
};

export default function PromoModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"register" | "login">("register");
console.log("PROMO MODAL RENDER");
  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Cerrar */}
        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>

        {/* SOLO mostrar descuento si está en registro */}
        {mode === "register" && (
          <>
            <h2
              style={{
                marginBottom: 14,
                fontSize: 40,
                fontWeight: 800,
                textAlign: "center",
                fontFamily: "system-ui",
              }}
            >
              🎁 10% DE DESCUENTO
            </h2>

            <p
              style={{
                fontSize: 18,
                color: "#555",
                marginBottom: 36,
                textAlign: "center",
              }}
            >
              Regístrate y obtén descuento en tu primera compra.
            </p>
          </>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            marginBottom: 30,
            borderBottom: "1px solid #eee",
            paddingBottom: 12,
          }}
        >
          <button
            onClick={() => setMode("register")}
            style={{
              background: "none",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              borderBottom:
                mode === "register" ? "2px solid black" : "none",
            }}
          >
            Registrarme
          </button>

          <button
            onClick={() => setMode("login")}
            style={{
              background: "none",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              borderBottom:
                mode === "login" ? "2px solid black" : "none",
            }}
          >
            Ingresar
          </button>
        </div>

        {/* Formularios */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          {mode === "register" ? (
            <RegisterForm />
          ) : (
            <LoginForm onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
