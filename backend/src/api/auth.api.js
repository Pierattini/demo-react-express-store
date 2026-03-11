import { apiClient } from "./client.js";

/**
 * Ejemplo de integración externa (opcional)
 * Puedes comentarlo si aún no usas APIs externas
 */
export async function registrarUsuarioExterno({ body = {}, authorization }) {
  const headers = {};
  if (authorization) headers.Authorization = authorization;

  const resp = await apiClient.post(
    process.env.API_REGISTRAR_USUARIO_EXTERNO,
    body,
    { headers }
  );

  return resp.data;
}