import { useEffect, useState } from "react";
import { getProducts } from "../lib/products";
import type { Product } from "../lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) =>
  setError(err instanceof Error ? err.message : "Error al cargar productos")
)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
