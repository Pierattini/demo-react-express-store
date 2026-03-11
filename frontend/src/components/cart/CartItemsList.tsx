import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../lib/types";

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

        const subtotal = product.price * item.quantity;

        return (

          <div
            key={item.product_id}
            className="flex gap-4 mb-6 border-b pb-4"
          >

            <img
              src={product.image}
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
                ${product.price.toFixed(2)}
              </p>

              <div className="flex items-center gap-2 mt-2">

                <button
                  onClick={() =>
                    update(item.product_id, item.quantity - 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    update(item.product_id, item.quantity + 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>

              </div>

            </div>

            <div className="text-right">

              <p className="font-medium">
                ${subtotal.toFixed(2)}
              </p>

              <button
                onClick={() =>
                  remove(item.product_id)
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