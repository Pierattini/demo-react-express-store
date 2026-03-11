import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import { httpGet } from "../../lib/http";

interface Summary {
  totalSales: number;
  totalOrders: number;
  totalUsers: number;
}

type RangeType = "today" | "month" | "custom";

export default function AdminHome() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState<RangeType>("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);

        let query = "";

        if (range === "today") {
          const today = new Date().toISOString().split("T")[0];
          query = `?from=${today}&to=${today}`;
        }

        if (range === "month") {
          const now = new Date();
          const firstDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
          )
            .toISOString()
            .split("T")[0];

          const today = now.toISOString().split("T")[0];
          query = `?from=${firstDay}&to=${today}`;
        }

        if (range === "custom" && from && to) {
          query = `?from=${from}&to=${to}`;
        }

        const data = await httpGet<Summary>(
          `/admin/summary${query}`,
          false
        );

        setSummary(data);
      } catch (error) {
        console.error("Error cargando resumen", error);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [range, from, to]);

  const totalSales = summary?.totalSales ?? 0;
  const totalOrders = summary?.totalOrders ?? 0;
  const totalUsers = summary?.totalUsers ?? 0;

  return (
    <DashboardLayout title="Resumen">

      {/* 🔥 Filtro de rango */}
      <div className="flex flex-wrap gap-4 items-center mb-6">

        <select
          value={range}
          onChange={(e) => setRange(e.target.value as RangeType)}
          className="border rounded px-3 py-2"
        >
          <option value="today">Hoy</option>
          <option value="month">Este mes</option>
          <option value="custom">Personalizado</option>
        </select>

        {range === "custom" && (
          <>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </>
        )}
      </div>

      {/* 🔥 Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-500">Ventas</p>
          <p className="text-2xl font-semibold mt-2">
            {loading ? "..." : `$${totalSales.toLocaleString()}`}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">Órdenes</p>
          <p className="text-2xl font-semibold mt-2">
            {loading ? "..." : totalOrders}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">Usuarios</p>
          <p className="text-2xl font-semibold mt-2">
            {loading ? "..." : totalUsers}
          </p>
        </Card>
      </div>

    </DashboardLayout>
  );
}
