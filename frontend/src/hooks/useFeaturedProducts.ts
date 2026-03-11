import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../lib/products";
import type { Product } from "../lib/types";

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Error cargando destacados"
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
