import { httpGet, httpPost, httpPut, httpDelete } from "./http";
import type { Product } from "./types";

export function getProducts() {
  return httpGet<Product[]>("/api/products", false);
}

export function createProduct(data: FormData) {
  return httpPost<Product, FormData>("/api/products", data);
}

export function updateProduct(
  id: number,
  data: Partial<Product> | FormData
) {
  return httpPut<Product, Partial<Product> | FormData>(
    `/api/products/${id}`,
    data
  );
}

export function deleteProduct(id: number) {
  return httpDelete<void>(`/api/products/${id}`);
}

export function getFeaturedProducts() {
  return httpGet<Product[]>("/api/products/featured", false);
}