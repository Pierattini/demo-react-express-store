import { X } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import ProductModal from "../product/ProductModal";
import { useState } from "react";
import type { Product } from "../../lib/types";

import CartItemsList from "./CartItemsList";
import CartFooter from "./CartFooter";
import CheckoutModal from "./CheckoutModal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const { items } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className="
        absolute right-0 top-6
        h-[calc(100vh-180px)] w-[420px]
        bg-white shadow-2xl
        rounded-l-xl
        flex flex-col
        animate-[slideIn_.25s_ease]
        "
      >

        {/* header */}
        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-xl font-semibold">
            Carrito
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>

        </div>

        {/* contenido */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">

          {items.length === 0 && (
            <p className="text-gray-500">
              Tu carrito está vacío
            </p>
          )}

          <CartItemsList
            onOpenProduct={setSelectedProduct}
            onCloseDrawer={onClose}
          />

        </div>

        {/* footer */}
        <CartFooter
          onCloseDrawer={onClose}
          onOpenCheckout={() => setShowCheckout(true)}
        />

        {/* modal producto */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* modal checkout */}
        {showCheckout && (
          <CheckoutModal
            onClose={() => setShowCheckout(false)}
          />
        )}

      </div>

    </div>
  );
}