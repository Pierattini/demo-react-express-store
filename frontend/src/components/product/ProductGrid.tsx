import type { Product } from "../../lib/types";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  onSelectProduct: (product: Product) => void;
};

export default function ProductGrid({ products, onSelectProduct }: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onClick={() => onSelectProduct(p)}
        />
      ))}
    </section>
  );
}