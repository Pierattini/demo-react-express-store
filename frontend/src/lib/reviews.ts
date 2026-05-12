import { httpGet, httpPost, httpPut, httpDelete } from "./http";

export type Review = {
  id: number;
  name: string;
  text: string;
  rating?: number;
};

export function getReviews() {
  return httpGet<Review[]>("/api/reviews", false);
}

export function createReview(data: Omit<Review, "id">) {
  return httpPost<Review, Omit<Review, "id">>("/api/reviews", data);
}

export function updateReview(id: number, data: Omit<Review, "id">) {
  return httpPut<Review, Omit<Review, "id">>(`/api/reviews/${id}`, data);
}

export function deleteReview(id: number) {
  return httpDelete<void>(`/api/reviews/${id}`);
}
