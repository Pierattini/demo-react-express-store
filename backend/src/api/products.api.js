import { apiClient } from "./client.js";

export async function obtenerProductosExternos() {
  const resp = await apiClient.get(
    process.env.API_OBTENER_PRODUCTOS_EXTERNOS
  );

  return resp.data;
}
