import { useState } from "react";
import Container from "../layout/Container";
import Heading from "../ui/Heading";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { useFeaturedProducts } from "../../hooks/useFeaturedProducts";
import type { Product } from "../../lib/types";
import ProductModal from "../product/ProductModal";
import { useTranslation } from "react-i18next";
import { getProductName } from "../../utils/translate";

export default function FeaturedProducts() {

  const { products, loading, error } = useFeaturedProducts();
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { t } = useTranslation();
  const visibleCount = 3;

  if (loading) {
    return (
      <section className="pt-24 pb-16">
        <Container>
          <div className="text-center text-sm text-gray-500">
            {t("loadingProducts")}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <Container>
          <EmptyState
            title={t("errorLoadingProducts")}
            description={error}
          />
        </Container>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-20">
        <Container>
          <EmptyState
            title={t("noProducts")}
            description={t("productsComingSoon")}
          />
        </Container>
      </section>
    );
  }

  const visibleProducts = products.slice(
    startIndex,
    startIndex + visibleCount
  );

  const next = () => {
    if (startIndex + visibleCount < products.length) {
      setStartIndex(startIndex + visibleCount);
    }
  };

  const prev = () => {
    if (startIndex - visibleCount >= 0) {
      setStartIndex(startIndex - visibleCount);
    }
  };

  return (
    <section className="py-20">
      <Container className="space-y-12">

        {/* Header */}
        <div className="text-center space-y-3">

          <Heading level={2}>
            {t("featuredProducts")}
          </Heading>

          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            {t("featuredSubtitle")}
          </p>

        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">

          {startIndex > 0 && (
            <button
              onClick={prev}
              className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full w-14 h-14 text-xl flex items-center justify-center hover:scale-105 transition"
            >
              ‹
            </button>
          )}

          <div className="
  flex
  flex-col
  md:flex-row
  gap-6
  w-full
  px-4
  justify-center
  items-stretch
">
            {visibleProducts.map((product) => (

              <Card
  key={product.id}
  onClick={() => setSelectedProduct(product)}
  className="w-full md:w-[320px] min-h-[430px] flex flex-col p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group cursor-pointer"
>

                <div className="h-72 rounded-2xl overflow-hidden bg-gray-100">

                  {product.image ? (

                    <img
                      src={
                        typeof product.image === "string"
                          ? product.image
                          : URL.createObjectURL(product.image)
                      }
                      alt={getProductName(product)}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />

                  ) : (

                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      {t("noImage")}
                    </div>

                  )}

                </div>

                <div className="flex flex-col flex-1 justify-between pt-4">
  <div className="min-h-[56px]">
    <h3 className="font-medium text-gray-900 line-clamp-2">
      {getProductName(product)}
    </h3>
  </div>

  <p className="font-semibold text-lg text-gray-900 mt-4">
    ${product.price}
  </p>
</div>

              </Card>

            ))}

          </div>

          {startIndex + visibleCount < products.length && (
            <button
              onClick={next}
              className="absolute -right-6 z-10 h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
            >
              ›
            </button>
          )}

        </div>

      </Container>

      {/* MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </section>
  );
}