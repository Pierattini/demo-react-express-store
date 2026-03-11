import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../lib/orders";
import type { Order } from "../lib/orders";
import OrderStatusBadge from "../components/ui/OrderStatusBadge";
import Card from "../components/ui/Card";
import { useTranslation } from "react-i18next";

export default function OrderDetail() {

  const { t } = useTranslation();

  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getOrderById(Number(id))
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f6f2ea]">
        {t("loadingOrder")}
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f6f2ea]">
        {t("orderNotFound")}
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f2ea] pt-24 pb-24">
      <div className="mx-auto max-w-3xl space-y-8">

        <Card className="p-6 space-y-4">
          <div className="flex justify-between">
            <strong>{t("order")} #{order.id}</strong>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="text-sm text-gray-500">
            {t("date")}: {new Date(order.created_at).toLocaleString()}
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-semibold">{t("shippingInfo")}</h3>

          <p>
            <strong>{t("name")}:</strong> {order.full_name}
          </p>

          <p>
            <strong>{t("address")}:</strong> {order.address}
          </p>

          <p>
            <strong>{t("phone")}:</strong> {order.phone}
          </p>

          {order.notes && (
            <p>
              <strong>{t("notes")}:</strong> {order.notes}
            </p>
          )}
        </Card>

        <Card className="p-6">
          <ul className="space-y-4">

            {order.items.map((item) => (

              <li
                key={item.product_id}
                className="flex justify-between border-b pb-4"
              >

                <div className="flex gap-4 items-center">

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}

                  <div>
                    <p>{item.name}</p>

                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                </div>

                <strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>

              </li>

            ))}

          </ul>

          <div className="flex justify-between mt-6 font-semibold text-lg">
            <span>{t("total")}</span>
            <span>${order.total.toFixed(2)}</span>
          </div>

        </Card>

        <div className="text-center">
          <Link to="/orders" className="text-blue-600 hover:underline">
            ← {t("backToOrders")}
          </Link>
        </div>

      </div>
    </section>
  );
}