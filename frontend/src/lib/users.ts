import { httpGet, httpPost, httpPut, httpDelete } from "./http";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

/* =========================
   GET USERS
========================= */

export async function getUsers() {
  return httpGet<User[]>("/users", true);
}

/* =========================
   CREATE USER
========================= */

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}) {
  return httpPost("/auth/register", data, true);
}

/* =========================
   UPDATE USER
========================= */

export async function updateUser(
  id: number,
  data: { name: string; email: string }
) {
  return httpPut(`/users/${id}`, data, true);
}

/* =========================
   CHANGE ROLE
========================= */

export async function changeUserRole(
  id: number,
  role: "user" | "admin"
) {
  return httpPut(`/users/${id}/role`, { role }, true);
}

/* =========================
   DELETE USER
========================= */

export async function deleteUser(id: number) {
  return httpDelete(`/users/${id}`, true);
}

/* =========================
   EXPORT EXCEL
========================= */

export async function exportUsersExcel() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/users/export/excel`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error descargando Excel");
  }

  return response.blob();
}