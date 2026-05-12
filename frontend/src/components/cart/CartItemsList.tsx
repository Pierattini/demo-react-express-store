import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../lib/types";
import { getFriendlyColorName } from "../../utils/colorName";

type Props = {
  onOpenProduct: (product: Product) => void;
  onCloseDrawer: () => void;
};

export default function CartItemsList({
  onOpenProduct,
  onCloseDrawer
}: Props) {

  const { items, remove, update } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  return (
    <>
      {items.map((item) => {

        const product = products.find(
          p => p.id === item.product_id
        );

        if (!product) return null;

        const colorHex = (item.color_hex || "").trim().toLowerCase();
        const productColor = product.colors?.find(
          (c) => (c.hex || "").trim().toLowerCase() === colorHex
        );
        const colorLabel = getFriendlyColorName(
          item.color_hex,
          item.color_name || productColor?.name
        );
        const displayImage = productColor?.image || product.image;

        const subtotal = product.price * item.quantity;

        return (

          <div
            key={`${item.product_id}-${item.color_hex || "default"}`}
            className="flex gap-4 mb-6 border-b pb-4"
          >

            <img
              src={displayImage}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer"
              onClick={() => onOpenProduct(product)}
            />

            <div className="flex-1">

              <p
                className="font-medium cursor-pointer hover:underline"
                onClick={() => {
                  navigate(`/product/${product.id}`);
                  onCloseDrawer();
                }}
              >
                {product.name}
              </p>

              <p className="text-sm text-gray-500">
                ${Math.round(product.price)}
              </p>

              {item.color_hex && (
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-gray-300"
                    style={{ backgroundColor: item.color_hex }}
                  />
                  <span>Color: {colorLabel}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">

                <button
                  onClick={() =>
                    update(item.product_id, item.quantity - 1, item.color_hex)
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    update(item.product_id, item.quantity + 1, item.color_hex)
                  }
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>

              </div>

            </div>

            <div className="text-right">

              <p className="font-medium">
                ${Math.round(subtotal)}
              </p>

              <button
                onClick={() =>
                  remove(item.product_id, item.color_hex)
                }
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>

            </div>

          </div>

        );

      })}
    </>
  );
}