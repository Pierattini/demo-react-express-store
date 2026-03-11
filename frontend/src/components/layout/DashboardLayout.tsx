import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

const navItems = [
  { path: "/admin", label: "Resumen" },
  { path: "/admin/products", label: "Productos" },
  { path: "/admin/orders", label: "Órdenes" },
  { path: "/admin/users", label: "Usuarios" },
  { path: "/admin/site", label: "Sitio" },

];

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-semibold text-lg">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-2 text-sm font-medium">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  block rounded-lg px-4 py-2 transition
                  ${
                    active
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
  
  {/* IZQUIERDA */}
  <div className="flex items-center gap-4">
    <button
      className="md:hidden text-xl"
      onClick={() => setSidebarOpen(true)}
    >
      ☰
    </button>

    <h1 className="text-lg font-semibold tracking-tight">
      {title}
    </h1>
  </div>

  {/* DERECHA */}
  <Link
    to="/"
    className="text-sm font-medium text-blue-600 hover:underline"
  >
    ← Volver al sitio
  </Link>

</header>


        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
