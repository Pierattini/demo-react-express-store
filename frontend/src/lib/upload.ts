import { http } from "./http";

export async function uploadImage(formData: FormData) {
  return http<{ url: string }>("/api/upload", {
    method: "POST",
    body: formData,
  });
}