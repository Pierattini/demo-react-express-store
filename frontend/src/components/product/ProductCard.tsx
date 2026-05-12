import { useCart } from "../../hooks/useCart";
import type { Product } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { getProductColorOptions } from "../../utils/productColorOptions";

type Props = {
  product: Product;
  onClick?: () => void;
};

export default function ProductCard({ product, onClick }: Props) {
  const cart = useCart();
  const { t } = useTranslation();

  const safeColors = useMemo(() => getProductColorOptions(product), [product]);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [desiredQuantity, setDesiredQuantity] = useState<number>(1);
  const outOfStock = product.stock <= 0;

  const selectedColor = safeColors[selectedColorIndex];
  const selectedColorHex = (selectedColor?.hex || "").trim().toLowerCase();

  const cartQuantity =
    cart.items.find(
      (item) =>
        item.product_id === product.id &&
        ((item.color_hex || "").trim().toLowerCase() === selectedColorHex)
    )?.quantity ?? 0;

  const activeImage = useMemo(() => {
    const colorImage = safeColors[selectedColorIndex]?.image;
    return colorImage || product.image;
  }, [safeColors, selectedColorIndex, product.image]);

  const optimizedImage = useMemo(() => {
    if (!activeImage) return "";
    return activeImage.replace("/upload/", "/upload/w_700,q_auto,f_auto/");
  }, [activeImage]);

  const handleColorClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.stopPropagation();
    setSelectedColorIndex(index);
  };

  useEffect(() => {
    if (cartQuantity > 0) {
      setDesiredQuantity(Math.min(cartQuantity, Math.max(product.stock, 1)));
    }
  }, [cartQuantity, product.stock, selectedColorHex]);

  const handleAcceptQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (outOfStock) return;

    if (cartQuantity === 0) {
      cart.add(product.id, desiredQuantity, selectedColor);
      return;
    }

    cart.update(product.id, desiredQuantity, selectedColorHex || undefined);
  };

  const handleDecreaseDesired = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDesiredQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseDesired = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (outOfStock) return;
    setDesiredQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  return (
    <article
      onClick={onClick}
      className="
        group flex flex-col overflow-hidden rounded-2xl
        border border-[#ddd5cd] bg-white shadow-md
        transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
        cursor-pointer
      "
    >
      <div className="relative overflow-hidden bg-[#f8f5ef]">
        <img
          src={optimizedImage}
          alt={product.name}
          loading="lazy"
          className="
            h-[220px] w-full object-cover
            transition-transform duration-500 group-hover:scale-[1.03]
          "
        />

        {safeColors.length > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-gray-800 shadow-md backdrop-blur-sm">
            {safeColors.length} {safeColors.length === 1 ? "color" : "colores"}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
          {product.name}
        </h3>

        <p className="mt-3 text-2xl font-bold text-[#6b896b]">
          ${Math.round(product.price)}
        </p>

        {safeColors.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {safeColors.slice(0, 5).map((c, i) => {
              const isActive = i === selectedColorIndex;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => handleColorClick(e, i)}
                  aria-label={c.name || `Color ${i + 1}`}
                  title={c.name || `Color ${i + 1}`}
                  className={`
                    relative h-5 w-5 rounded-full border-2 transition-all duration-200
                    ${
                      isActive
                        ? "scale-110 border-[#5d7a5d] ring-3 ring-[#7c9a7c]/50 shadow-sm"
                        : "border-[#c0b5a8] hover:scale-105 hover:border-[#7c9a7c]"
                    }
                  `}
                  style={{ backgroundColor: c.hex }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full ring-1 ring-white/70" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        <p
          className={`mt-3 text-xs font-medium ${
            outOfStock ? "text-red-500" : "text-[#6b896b]"
          }`}
        >
          {outOfStock
            ? t("outOfStock")
            : `Stock disponible: ${product.stock}`}
        </p>

        <div className="pt-3">
          <div className="mb-3 flex items-center justify-between rounded-lg border border-[#d0dbd0] bg-[#f8fcf8] px-3 py-2.5 shadow-xs">
            <span className="text-xs font-semibold text-[#5d7a5d] uppercase tracking-wide">Cantidad</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecreaseDesired}
                className="h-7 w-7 rounded-full border border-[#c0b5a8] text-[#5d7a5d] font-bold transition duration-200 hover:bg-[#f0e8e0] hover:border-[#7c9a7c]"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="min-w-6 text-center text-sm font-bold text-[#476347]">
                {desiredQuantity}
              </span>
              <button
                type="button"
                onClick={handleIncreaseDesired}
                className="h-7 w-7 rounded-full border border-[#c0b5a8] text-[#5d7a5d] font-bold transition duration-200 hover:bg-[#f0e8e0] hover:border-[#7c9a7c]"
                aria-label="Aumentar cantidad"
                disabled={outOfStock || desiredQuantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <p className="mb-3 min-h-[20px] text-xs font-medium text-[#5d7a5d]">
            {cartQuantity > 0
              ? `En carrito: ${cartQuantity}${
                  selectedColor?.name ? ` (${selectedColor.name})` : ""
                }`
              : "\u00A0"}
          </p>

          <button
            type="button"
            disabled={outOfStock}
            onClick={handleAcceptQuantity}
            className={`
              w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-300
              ${
                outOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : "bg-[#7c9a7c] text-white shadow-md hover:bg-[#6b896b] hover:shadow-lg hover:scale-[1.01]"
              }
            `}
          >
            {outOfStock ? t("notAvailable") : "Aceptar cantidad"}
          </button>
        </div>
      </div>
    </article>
  );
}