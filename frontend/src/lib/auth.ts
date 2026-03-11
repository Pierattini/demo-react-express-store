import { httpPost } from "./http";

/* ===============================
   TYPES
================================ */

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

/* ===============================
   LOGIN
================================ */

export function login(email: string, password: string) {
  return httpPost<LoginResponse, { email: string; password: string }>(
    "/auth/login",
    { email, password }
  );
}

/* =========================
   REGISTER
========================= */

export function register(
  name: string,
  email: string,
  password: string
) {
  return httpPost<
    { message: string },
    { name: string; email: string; password: string }
  >(
    "/auth/register",
    { name, email, password },
    false
  );
}