import { useMemo, useState } from "react";
import type { Product } from "../../lib/types";

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 🔎 Buscar por nombre
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ↕ Ordenar
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, sort]);

  return {
    search,
    setSearch,
    sort,
    setSort,
    filteredProducts,
  };
}
