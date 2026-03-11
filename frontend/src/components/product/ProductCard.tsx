import { useCart } from "../../hooks/useCart";
import type { Product } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

type Props = {
  product: Product;
  onClick?: () => void;
};

export default function ProductCard({ product, onClick }: Props) {
  const cart = useCart();
  const { t } = useTranslation();

  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const outOfStock = product.stock <= 0;

  const safeColors = product.colors ?? [];

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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (outOfStock) return;
    cart.add(product.id, 1);
  };

  return (
    <article
      onClick={onClick}
      className="
        group flex flex-col overflow-hidden rounded-2xl
        border border-[#ece6dc] bg-white shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
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
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur">
            {safeColors.length} {safeColors.length === 1 ? "color" : "colores"}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-medium leading-tight text-gray-800">
          {product.name}
        </h3>

        <p className="mt-2 text-lg font-semibold text-[#6b896b]">
          ${product.price.toFixed(2)}
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
                    relative h-5 w-5 rounded-full border transition-all duration-200
                    ${
                      isActive
                        ? "scale-110 border-gray-800 ring-2 ring-[#7c9a7c]/40"
                        : "border-gray-300 hover:scale-105"
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
          className={`mt-3 text-sm ${
            outOfStock ? "text-red-500" : "text-[#7c9a7c]"
          }`}
        >
          {outOfStock
            ? t("outOfStock")
            : `${t("stockAvailable")}: ${product.stock}`}
        </p>

        <div className="mt-auto pt-4">
          <button
            type="button"
            disabled={outOfStock}
            onClick={handleAddToCart}
            className={`
              w-full rounded-xl px-4 py-2.5 text-sm font-medium transition duration-300
              ${
                outOfStock
                  ? "cursor-not-allowed bg-gray-200 text-gray-500"
                  : "bg-[#7c9a7c] text-white shadow-sm hover:bg-[#6b896b] hover:shadow-md"
              }
            `}
          >
            {outOfStock ? t("notAvailable") : t("addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}