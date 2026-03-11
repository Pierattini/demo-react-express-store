import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../lib/orders";
import type { Order } from "../lib/orders";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import OrdersSkeleton from "../components/ui/OrdersSkeleton";
import Heading from "../components/ui/Heading";
import { useTranslation } from "react-i18next";

export default function Orders() {

  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    getMyOrders()
      .then(setOrders)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : t("loadOrdersError")
        )
      )
      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {

    return (
      <div className="mx-auto max-w-2xl space-y-4">

        <Heading level={2}>
          {t("myOrders")}
        </Heading>

        <p className="text-gray-600">
          {t("noOrders")}
        </p>

        <Link
          to="/catalog"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {t("goToCatalog")} →
        </Link>

      </div>
    );
  }

  return (

    <div className="mx-auto max-w-2xl space-y-6">

      <Heading level={2}>
        {t("myOrders")}
      </Heading>

      <ul className="space-y-4">

        {orders.map((order) => (

          <li
            key={order.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-2"
          >

            <div className="flex items-center justify-between">

              <strong className="text-base">
                {t("order")} #{order.id}
              </strong>

              <OrderStatusBadge status={order.status} />

            </div>

            <p className="text-sm text-gray-600">
              {t("date")}:{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </p>

            <div className="flex items-center justify-between pt-2">

              <span className="font-semibold">
                {t("total")}: ${order.total.toFixed(2)}
              </span>

              <Link
                to={`/orders/${order.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {t("viewDetail")} →
              </Link>

            </div>

          </li>

        ))}

      </ul>

    </div>
  );
}