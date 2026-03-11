import { Routes, Route } from "react-router-dom";
import PageLayout from "./components/layout/PageLayout";

import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Contact from "./pages/Contact";

import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

import OrderSuccess from "./pages/OrderSuccess";
import OrderError from "./pages/OrderError";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

import RequireAuth from "./components/auth/RequireAuth";
import RequireGuest from "./components/auth/RequireGuest";
import RequireAdmin from "./components/auth/RequireAdmin";

import AdminHome from "./pages/admin/AdminHome";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSite from "./pages/admin/AdminSite";

export default function App() {
  return (
    <Routes>

      {/* 🔹 RUTAS PÚBLICAS (CON NAVBAR) */}
      <Route element={<PageLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/order-error" element={<OrderError />} />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/orders"
          element={
            <RequireAuth>
              <Orders />
            </RequireAuth>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <OrderDetail />
            </RequireAuth>
          }
        />

      </Route>

      {/* 🔐 ADMIN (SIN NAVBAR PÚBLICO) */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminHome />
          </RequireAdmin>
        }
      />

      <Route
        path="/admin/products"
        element={
          <RequireAdmin>
            <AdminProducts />
          </RequireAdmin>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <RequireAdmin>
            <AdminOrders />
          </RequireAdmin>
        }
      />

      <Route
        path="/admin/users"
        element={
          <RequireAdmin>
            <AdminUsers />
          </RequireAdmin>
        }
      />

      <Route
        path="/admin/site"
        element={
          <RequireAdmin>
            <AdminSite />
          </RequireAdmin>
        }
      />

      {/* 🔓 SOLO INVITADOS */}
      <Route
        path="/login"
        element={
          <RequireGuest>
            <Login />
          </RequireGuest>
        }
      />

      <Route
        path="/register"
        element={
          <RequireGuest>
            <Register />
          </RequireGuest>
        }
      />

    </Routes>
  );
}