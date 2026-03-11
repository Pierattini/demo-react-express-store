import { pool } from "../db.js";
import bcrypt from "bcrypt";

/* ======================
   REGISTRO (PUBLIC)
====================== */
export async function createUser({ name, email, password, role = "user" }) {
  const passwordHash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role
    `,
    [name, email, passwordHash, role]
  );

  return rows[0];
}

/* ======================
   LOGIN (PUBLIC)
====================== */
export async function loginUser({ email, password }) {
  const { rows } = await pool.query(
    `
    SELECT id, name, email, role, password
    FROM users
    WHERE email = $1 AND active = true
    LIMIT 1
    `,
    [email]
  );

  const user = rows[0];
  if (!user) throw new Error("Credenciales inválidas");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciales inválidas");

  delete user.password;
  return user;
}

/* ======================
   ADMIN - LISTAR USUARIOS
====================== */
export async function getAllUsers() {
  const { rows } = await pool.query(
    `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE active = true
    ORDER BY id
    `
  );
  return rows;
}

/* ======================
   ADMIN - OBTENER USUARIO
====================== */
export async function getUserById(id) {
  const { rows } = await pool.query(
    `
    SELECT id, name, email, role
    FROM users
    WHERE id = $1 AND active = true
    `,
    [id]
  );
  return rows[0];
}

/* ======================
   ADMIN - DESACTIVAR USUARIO (SOFT DELETE)
====================== */
export async function deleteUserById(id) {
  await pool.query(
    `
    UPDATE users
    SET active = false
    WHERE id = $1
    `,
    [id]
  );
}

/* ======================
   ADMIN - CAMBIAR ROL
====================== */
export async function updateUserRole(id, role) {
  const allowed = ["user", "admin"];
  if (!allowed.includes(role)) {
    throw new Error("Rol inválido");
  }

  const { rows } = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, name, email, role
    `,
    [role, id]
  );

  return rows[0];
}

/* ======================
   ADMIN - RESET PASSWORD
====================== */
export async function resetUserPassword(id, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    `,
    [passwordHash, id]
  );
}
export async function updateUserById(id, name, email) {

  // Verificar si email ya existe en otro usuario
  const { rows: existing } = await pool.query(
    `
    SELECT id FROM users
    WHERE email = $1
      AND id <> $2
      AND active = true
    `,
    [email, id]
  );

  if (existing.length > 0) {
    throw new Error("El email ya está en uso");
  }

  const { rows } = await pool.query(
    `
    UPDATE users
    SET name = $1,
        email = $2
    WHERE id = $3
      AND active = true
    RETURNING id, name, email, role
    `,
    [name, email, id]
  );

  return rows[0];
}

