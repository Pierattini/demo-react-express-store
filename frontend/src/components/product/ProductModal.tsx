import type { Product } from "../../lib/types";
import { useCart } from "../../hooks/useCart";
import { ShoppingCart } from "lucide-react";
import { getProductName, getProductDescription } from "../../utils/translate";
import { useState } from "react";

type Props = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {

  const { add } = useCart();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-md relative shadow-2xl overflow-hidden">

        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition text-xl"
        >
          ✕
        </button>

        {/* Imagen */}
        {(selectedImage || product.image) && (
          <div className="w-full bg-gray-100 flex items-center justify-center p-4">
            <img
              src={(selectedImage || product.image).replace(
                "/upload/",
                "/upload/w_700,q_auto,f_auto/"
              )}
              alt={getProductName(product)}
              className="w-full h-full object-cover transition duration-500"
            />
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 space-y-4 relative">

          <h2 className="text-2xl font-semibold text-gray-900">
            {getProductName(product)}
          </h2>

          <p className="text-xl font-bold text-gray-900">
            ${product.price}
          </p>

          {/* COLORES */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-3 mt-4">

              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={(e)=>{
                    e.stopPropagation();
                    setSelectedColor(i);

                    if(c.image){
                      setSelectedImage(c.image);
                    }else{
                      setSelectedImage(product.image);
                    }
                  }}
                  className={`
                    w-6 h-6 rounded-full border transition
                    ${selectedColor === i
                      ? "ring-2 ring-[#7c9a7c] scale-110"
                      : "border-gray-300 hover:scale-105"}
                  `}
                  style={{ backgroundColor: c.hex }}
                />
              ))}

            </div>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {getProductDescription(product)}
            </p>
          )}

          {/* Botón agregar */}
          <button
            onClick={() => {
              add(product.id, 1);
              onClose();
            }}
            className="
              absolute -top-7 right-6
              h-14 w-14
              rounded-full
              bg-[#7c9a7c]
              text-white
              flex items-center justify-center
              shadow-xl
              hover:scale-110
              hover:bg-[#6b896b]
              transition-all duration-300
            "
          >
            <ShoppingCart className="w-6 h-6" />
          </button>

        </div>
      </div>
    </div>
  );
}