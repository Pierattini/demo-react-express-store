import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./hooks/CartProvider";
import { AuthProvider } from "./context/AuthProvider";
import { SiteConfigProvider } from "./context/SiteConfigProvider";
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SiteConfigProvider>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </SiteConfigProvider>
  </AuthProvider>
);