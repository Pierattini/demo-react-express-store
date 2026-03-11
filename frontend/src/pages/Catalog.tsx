import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "../lib/types";
import ProductGrid from "../components/product/ProductGrid";
import ProductSkeleton from "../components/product/ProductSkeleton";
import ProductFilters from "../components/product/ProductFilters";
import { useProducts } from "../hooks/useProducts";
import { useProductFilters } from "../components/product/useProductFilters";
import Container from "../components/layout/Container";
import Heading from "../components/ui/Heading";
import ProductModal from "../components/product/ProductModal";

export default function Catalog() {

  const { t } = useTranslation();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { products, loading, error } = useProducts();

  const {
    search,
    setSearch,
    sort,
    setSort,
    filteredProducts,
  } = useProductFilters(products);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#f6f2ea] pt-24 pb-24">
        <Container className="space-y-12">

          <Heading level={2} className="text-3xl text-gray-800">
            {t("catalogTitle")}
          </Heading>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>

        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#f6f2ea] flex items-center justify-center">
        <p className="text-red-500 text-lg font-medium">
          {t("errorLoadingProducts")}
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f6f2ea] pb-24">
      <Container className="space-y-12 pt-4">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">

          <div className="space-y-2">

            <Heading
              level={2}
              className="text-4xl font-semibold text-gray-800"
            >
              {t("catalogTitle")}
            </Heading>

            <p className="text-gray-500 text-sm">
              {t("catalogSubtitle")}
            </p>

          </div>

          <span className="px-5 py-2 rounded-full bg-[#e5efe5] text-[#6b896b] text-sm font-medium">
            {filteredProducts.length} {t("productsCount")}
          </span>

        </header>

        {/* FILTROS */}
        <div className="bg-white pt-10 pb-6 px-6 rounded-3xl shadow-md border border-[#ece6dc]">

          <ProductFilters
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
          />

        </div>

        {/* GRID */}
        <ProductGrid
          products={filteredProducts}
          onSelectProduct={setSelectedProduct}
        />

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

      </Container>
    </section>
  );
}