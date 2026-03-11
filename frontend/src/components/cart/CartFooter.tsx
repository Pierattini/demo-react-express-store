import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";

type Props = {
  onCloseDrawer: () => void;
  onOpenCheckout: () => void;
};

export default function CartFooter({ onOpenCheckout }: Props) {

  const { items } = useCart();
  const { products } = useProducts();

  const total = items.reduce((sum, item) => {

    const product = products.find(
      p => p.id === item.product_id
    );

    if (!product) return sum;

    return sum + product.price * item.quantity;

  }, 0);

  return (

    <div className="border-t p-6 pb-16 bg-white">

      <div className="flex justify-between mb-4 font-semibold text-lg">

        <span>Total</span>

        <span>
          ${total.toFixed(2)}
        </span>

      </div>

      <button
        disabled={items.length === 0}
        onClick={onOpenCheckout}
        className="
        w-full
        bg-[#7C3AED]
        text-white
        py-3
        rounded-lg
        font-medium
        hover:opacity-90
        transition
        disabled:opacity-50
        "
      >
        Checkout
      </button>

    </div>

  );
}