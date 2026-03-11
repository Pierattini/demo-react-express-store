import {
  getAllUsers,
  deleteUserById,
  updateUserRole,
  updateUserById // 👈 NUEVO
} from "../services/users.service.js";

import ExcelJS from "exceljs";

/* ======================
   GET /users
====================== */
export async function getUsers(req, res) {
  const users = await getAllUsers();
  res.json(users);
}

/* ======================
   DELETE /users/:id
====================== */
export async function deleteUser(req, res) {
  const { id } = req.params;

  await deleteUserById(id);

  res.json({
    message: "Usuario eliminado",
  });
}

/* ======================
   PUT /users/:id/role
====================== */
export async function changeUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["user", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Rol inválido",
    });
  }

  const user = await updateUserRole(id, role);

  res.json({
    message: "Rol actualizado",
    user,
  });
}

/* ======================
   PUT /users/:id
   Editar nombre y email
====================== */
export async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Nombre y email son obligatorios",
    });
  }

  const updatedUser = await updateUserById(id, name, email);

  res.json({
    message: "Usuario actualizado",
    user: updatedUser,
  });
}

/* ======================
   GET /users/export/excel
====================== */
export async function exportUsersExcel(req, res) {
  try {
    const users = await getAllUsers();

    // ❌ Excluir admins
    const filteredUsers = users.filter(user => user.role !== "admin");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Rol", key: "role", width: 15 },
    ];

    filteredUsers.forEach(user => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=usuarios.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Error generando Excel:", error);
    res.status(500).json({ message: "Error generando Excel" });
  }
}
