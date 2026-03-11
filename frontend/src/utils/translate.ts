import i18n from "i18next";
import type { Product } from "../lib/types";

export function getProductName(product: Product) {
  return i18n.language.startsWith("en")
    ? product.name_en || product.name
    : product.name;
}

export function getProductDescription(product: Product) {
  return i18n.language.startsWith("en")
    ? product.description_en || product.description
    : product.description;
}