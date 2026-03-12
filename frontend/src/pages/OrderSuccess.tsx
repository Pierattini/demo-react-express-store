import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { getOrderById } from "../lib/orders";
import type { Order } from "../lib/orders";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import Card from "../components/ui/Card";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;
export default function OrderSuccess() {

  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderIdFromState =
    (location.state as { orderId?: number })?.orderId;
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const loadOrder = async () => {

      try {

        if (orderIdFromState) {
          const data = await getOrderById(orderIdFromState);
          setOrder(data);
          return;
        }

        if (sessionId) {

          const res = await fetch(`${API_URL}/api/payments/stripe/order-status?session_id=${sessionId}`)
          const { orderId } = await res.json();

          if (!orderId) {
            throw new Error("Orden no encontrada");
          }

          const fullOrder = await getOrderById(orderId);
          setOrder(fullOrder);

          if (
            fullOrder.payment_method === "stripe" &&
            fullOrder.status === "pending"
          ) {

            const interval = setInterval(async () => {

              const updated = await getOrderById(orderId);

              if (updated.status === "paid") {
                setOrder(updated);
                clearInterval(interval);
              }

            }, 3000);

            return () => clearInterval(interval);
          }

          return;
        }

        setError(t("orderNotFound"));

      } catch {

        setError(t("loadOrderError"));

      } finally {

        setLoading(false);

      }
    };

    loadOrder();

  }, [orderIdFromState, sessionId, t]);
  if (!orderIdFromState && !sessionId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-[#f6f2ea] flex items-center justify-center">
        <p className="text-gray-600">{t("loadingOrder")}</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-[#f6f2ea] flex items-center justify-center">
        <p className="text-red-600">
          {error ?? t("orderLoadFail")}
        </p>
      </section>
    );
  }

  const detailedItems = order.items ?? [];

  return (
    <section className="min-h-screen bg-[#f6f2ea] pt-24 pb-24">
      <div className="mx-auto max-w-3xl space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-3">

          <h1 className="text-4xl font-semibold text-[#6b896b]">
            {t("orderCreated")}
          </h1>

          <p className="text-gray-500">
            {t("orderRegistered")}
          </p>

        </div>

        {/* RESUMEN */}
        <Card className="p-6 space-y-4 rounded-2xl border border-[#ece6dc] shadow-sm">

          <div className="flex items-center justify-between">

            <strong className="text-lg text-gray-800">
              {t("order")} #{order.id}
            </strong>

            <OrderStatusBadge status={order.status} />

          </div>

          <p className="text-sm text-gray-500">
            {t("date")}: {new Date(order.created_at).toLocaleString()}
          </p>

        </Card>

        <p className="text-sm text-gray-600">
          <strong>{t("paymentMethod")}:</strong>{" "}
          {order.payment_method === "stripe"
            ? t("cardStripe")
            : t("bankTransfer")}
        </p>

        {/* DATOS DE DESPACHO */}
        <Card className="p-6 rounded-2xl border border-[#ece6dc] shadow-sm space-y-3">

          <h3 className="text-lg font-semibold text-gray-800">
            {t("shippingInfo")}
          </h3>

          <p className="text-sm text-gray-600">
            <strong>{t("name")}:</strong> {order.full_name}
          </p>

          <p className="text-sm text-gray-600">
            <strong>{t("address")}:</strong> {order.address}
          </p>

          <p className="text-sm text-gray-600">
            <strong>{t("phone")}:</strong> {order.phone}
          </p>

          {order.notes && (
            <p className="text-sm text-gray-600">
              <strong>{t("notes")}:</strong> {order.notes}
            </p>
          )}

        </Card>

        {/* TRANSFERENCIA */}
        {order.payment_method === "bank_transfer" && order.bankDetails && (

          <Card className="p-6 rounded-2xl border border-[#ece6dc] shadow-sm space-y-3">

            <h3 className="text-lg font-semibold text-gray-800">
              {t("bankDetails")}
            </h3>

            <p className="text-sm text-gray-600">
              <strong>{t("bank")}:</strong> {order.bankDetails.bank_name}
            </p>

            <p className="text-sm text-gray-600">
              <strong>{t("holder")}:</strong> {order.bankDetails.bank_holder}
            </p>

            <p className="text-sm text-gray-600">
              <strong>{t("account")}:</strong> {order.bankDetails.bank_account}
            </p>

            <p className="text-sm text-amber-600">
              ⚠ {t("bankWarning")}
            </p>

          </Card>

        )}

        {/* DETALLE */}
        <Card className="p-6 rounded-2xl border border-[#ece6dc] shadow-sm">

          <ul className="space-y-6">

            {detailedItems.map((item) => (

              <li
                key={item.product_id}
                className="flex items-center justify-between border-b pb-4 last:border-none"
              >

                <div className="flex items-center gap-4">

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-[#ece6dc]"
                    />
                  )}

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                </div>

                <strong className="text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>

              </li>

            ))}

          </ul>

          <div className="mt-6 flex items-center justify-between text-lg font-semibold">
            <span>{t("total")}</span>
            <span className="text-[#6b896b]">
              ${order.total.toFixed(2)}
            </span>
          </div>

        </Card>

        {/* BOTONES */}
        <div className="flex gap-6 justify-center pt-6">

          <Link
            to="/orders"
            className="px-6 py-3 rounded-xl text-sm font-medium
                       bg-[#e3f0ff] text-[#3b82f6]
                       hover:bg-[#d6e8ff] transition duration-300 shadow-sm"
          >
            {t("viewOrders")}
          </Link>

          <Link
            to="/catalog"
            className="px-6 py-3 rounded-xl text-sm font-medium
                       bg-[#dff5f0] text-[#0f766e]
                       hover:bg-[#c8ede6] transition duration-300 shadow-sm"
          >
            {t("continueShopping")}
          </Link>

        </div>

      </div>
    </section>
  );
}