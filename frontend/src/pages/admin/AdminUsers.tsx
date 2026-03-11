import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import { httpGet, httpDelete, httpPut } from "../../lib/http";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Modal crear
  const [openModal, setOpenModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  });

  // 🔹 Modal editar
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await httpGet<User[]>("/users", true);
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios (" , error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar usuario?")) return;

    await httpDelete(`/users/${id}`, true);
    loadUsers();
  }

  async function handleChangeRole(id: number, role: "user" | "admin") {
    await httpPut(`/users/${id}/role`, { role }, true);
    loadUsers();
  }

  // 🔹 Abrir modal editar
  function handleOpenEdit(user: User) {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  }

  // 🔹 Guardar cambios edición
  async function handleUpdateUser() {
    if (!editingUser) return;

    await httpPut(
      `/users/${editingUser.id}`,
      { name: editName, email: editEmail },
      true
    );

    setEditingUser(null);
    loadUsers();
  }

  async function handleCreateUser() {
    try {
      await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      setOpenModal(false);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      loadUsers();
    } catch (error) {
      console.error("Error creando usuario", error);
    }
  }

  async function handleExportExcel() {
    try {
      const response = await fetch(
        "http://localhost:3000/users/export/excel",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error descargando Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "usuarios.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error exportando usuarios:", error);
    }
  }

  return (
    <DashboardLayout title="Usuarios">
      <Card className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Gestión de usuarios del sistema
          </h3>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
            >
              Descargar Excel
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
            >
              + Nuevo usuario
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th className="py-3">Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    Cargando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    No hay usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                        {user.role}
                      </span>
                    </td>

                    <td className="text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          handleChangeRole(
                            user.id,
                            user.role === "admin" ? "user" : "admin"
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      >
                        Cambiar rol
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 🔹 MODAL CREAR */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold">Nuevo Usuario</h2>

            <input
              type="text"
              placeholder="Nombre"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="email"
              placeholder="Correo"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreateUser}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Crear usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 MODAL EDITAR */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold">Editar usuario</h3>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
