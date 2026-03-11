// src/lib/http.ts

/* ======================================================
   CONFIG
====================================================== */
const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definido en el frontend");
}

/* ======================================================
   TIPOS
====================================================== */
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface HttpOptions extends RequestInit {
  method?: HttpMethod;
  auth?: boolean; // forzar auth on/off
}

type ErrorPayload = {
  message?: string;
  error?: string;
};

/* ======================================================
   HELPERS INTERNOS
====================================================== */
function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string") {
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const d = data as ErrorPayload;
    return d.message || d.error || `Error HTTP ${status}`;
  }

  return `Error HTTP ${status}`;
}

/* ======================================================
   HTTP CLIENT
====================================================== */
export async function http<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers,
    auth = true,
    ...rest
  } = options;

  const token = auth ? localStorage.getItem("token") : null;
  console.log("TOKEN EN HTTP:", token);

  const isFormData = rest.body instanceof FormData;
console.log("REQUEST URL:", `${API_URL}${url}`);
const response = await fetch(`${API_URL}${url}`, {
  method,
  ...rest,
  headers: {
  ...(method !== "GET" && !isFormData
    ? { "Content-Type": "application/json" }
    : {}),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(headers || {}),
},
});


  /* ======================================================
     MANEJO DE RESPUESTA
  ====================================================== */
  const contentType = response.headers.get("content-type");
  let data: unknown = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  /* ======================================================
     MANEJO DE ERRORES
  ====================================================== */
  if (!response.ok) {
    const message = extractErrorMessage(data, response.status);

   if ((response.status === 401 || response.status === 403) && auth) {
  console.warn("Token expirado o inválido");

  localStorage.removeItem("token");

  window.location.href = "/login";

  throw new Error("Sesión expirada");
}
    throw new Error(message);
  }

  return data as T;
}

/* ======================================================
   HELPERS PÚBLICOS
====================================================== */

// GET
export function httpGet<T>(url: string, auth = true) {
  return http<T>(url, { method: "GET", auth });
}

// POST
export function httpPost<T, B = unknown>(
  url: string,
  body: B,
  auth = true
) {
  return http<T>(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
    auth,
  });
}

// PUT
export function httpPut<T, B = unknown>(
  url: string,
  body: B,
  auth = true
) {
  return http<T>(url, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
    auth,
  });
}


// DELETE
export function httpDelete<T>(url: string, auth = true) {
  return http<T>(url, { method: "DELETE", auth });
}
