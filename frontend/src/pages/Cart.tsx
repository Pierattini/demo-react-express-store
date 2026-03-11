import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../lib/types";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Section from "../components/layout/Section";
import EmptyState from "../components/ui/EmptyState";
import Heading from "../components/ui/Heading";

type DetailedCartItem = {
  product: Product;
  quantity: number;
};

export default function CartPage() {

  const { t } = useTranslation();

  const cart = useCart();
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<"bank_transfer" | "stripe">("bank_transfer");

  const [shippingData, setShippingData] = useState({
    full_name: "",
    address: "",
    phone: "",
    notes: ""
  });

  const detailedItems: DetailedCartItem[] = useMemo(() => {
    return cart.items
      .map((item) => {
        const product = products.find((p: Product) => p.id === item.product_id);
        if (!product) return null;

        return {
          product,
          quantity: item.quantity,
        };
      })
      .filter(Boolean) as DetailedCartItem[];
  }, [cart.items, products]);

  if (loading) {
    return (
      <Section size="lg">
        <Heading level={2}>{t("cartTitle")}</Heading>
      </Section>
    );
  }

  if (detailedItems.length === 0) {
    return (
      <Section size="md">
        <Heading level={2}>{t("cartTitle")}</Heading>

        <EmptyState
          title={t("emptyCartTitle")}
          description={t("emptyCartDesc")}
          actionLabel={t("goCatalog")}
          onAction={() => navigate("/catalog")}
          icon="🛒"
        />
      </Section>
    );
  }

  const total = detailedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {

    if (!shippingData.address || !shippingData.phone) {
      setError(t("errorAddressPhone"));
      return;
    }

    try {

      setProcessing(true);
      setError(null);

      const res = await cart.checkout({
        ...shippingData,
        paymentMethod,
      });

      setShowCheckoutModal(false);

      navigate("/order-success", {
        state: { orderId: res.order.id }
      });

    } catch {
      setError(t("errorCheckout"));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Section size="lg">

      <Heading level={2}>{t("cartTitle")}</Heading>

      <Card className="p-6 space-y-4">

        <ul className="space-y-4">

          {detailedItems.map(({ product, quantity }) => (

            <li
              key={product.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b pb-4 last:border-none"
            >

              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  ${product.price.toFixed(2)} c/u
                </p>
              </div>

              <Input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  cart.update(
                    product.id,
                    Math.min(Number(e.target.value), product.stock)
                  )
                }
                className="w-20"
              />

              <Button
                onClick={() => cart.remove(product.id)}
                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 text-xs"
              >
                {t("remove")}
              </Button>

            </li>

          ))}

        </ul>

        <div className="flex justify-between text-lg font-semibold pt-4 border-t">
          <span>{t("total")}</span>

          <span className="text-[#7C3AED]">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between gap-4 pt-4">

          <Button
            onClick={cart.clear}
            className="bg-blue-200 text-blue-900 hover:bg-blue-300"
          >
            {t("emptyCart")}
          </Button>

          <Button
            onClick={() => setShowCheckoutModal(true)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
          >
            {t("checkout")}
          </Button>

        </div>

      </Card>

      <Link
        to="/catalog"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← {t("continueShopping")}
      </Link>

      {showCheckoutModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-6">

            <h2 className="text-2xl font-semibold">
              {t("shippingData")}
            </h2>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "bank_transfer" | "stripe")
              }
              className="w-full border rounded-lg p-3"
            >
              <option value="bank_transfer">{t("bankTransfer")}</option>
              <option value="stripe">{t("cardPayment")}</option>
            </select>

            <div className="space-y-4">

              <input
                type="text"
                placeholder={t("fullName")}
                value={shippingData.full_name}
                onChange={(e) =>
                  setShippingData({ ...shippingData, full_name: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                placeholder={t("fullAddress")}
                value={shippingData.address}
                onChange={(e) =>
                  setShippingData({ ...shippingData, address: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <input
                type="text"
                placeholder={t("contactPhone")}
                value={shippingData.phone}
                onChange={(e) =>
                  setShippingData({ ...shippingData, phone: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

              <textarea
                placeholder={t("notesOptional")}
                value={shippingData.notes}
                onChange={(e) =>
                  setShippingData({ ...shippingData, notes: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div className="border-t pt-4 flex justify-between text-sm">

              <span>{t("total")}</span>

              <strong className="text-[#7C3AED]">
                ${total.toFixed(2)}
              </strong>

            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-4">

              <Button
                onClick={() => setShowCheckoutModal(false)}
                className="bg-gray-200 hover:bg-gray-300"
              >
                {t("cancel")}
              </Button>

              <Button
                onClick={handleConfirmOrder}
                disabled={processing}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              >
                {processing ? t("processing") : t("confirmOrder")}
              </Button>

            </div>

          </div>

        </div>

      )}

    </Section>
  );
}