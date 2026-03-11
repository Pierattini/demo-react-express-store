import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import { 
  getAllOrders, 
  updateOrderStatus, 
  getOrderById, 
  updateOrder,
  type Order,
  type OrderItem
} from "../../lib/orders";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
const [editItems, setEditItems] = useState<OrderItem[]>([]);
const [editShipping, setEditShipping] = useState<{
  full_name: string;
  address: string;
  phone: string;
  notes?: string;
} | null>(null);
  //const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch {
      setError("Error cargando órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch {
      alert("Error actualizando estado");
    }
  };

  const handleDelete = async (id: number) => {
  if (!confirm("¿Seguro que quieres cancelar esta orden?")) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/orders/${id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    loadOrders();
  } catch {
    alert("Error cancelando orden");
  }
};

const openEdit = async (orderId: number) => {
  try {
    const data = await getOrderById(orderId);

    setEditingOrder(data);
    setEditItems(data.items);
    setEditShipping({
  full_name: data.full_name || "",
  address: data.address || "",
  phone: data.phone || "",
  notes: data.notes || "",
});
  } catch {
    alert("Error cargando pedido");
  }
};

const handleSave = async () => {
  if (!editingOrder || !editShipping) return;

  try {
    await updateOrder(editingOrder.id, {
      items: editItems,
      shipping: editShipping,
    });

    setEditingOrder(null);
    loadOrders();
  } catch {
    alert("Error actualizando pedido");
  }
};
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout title="Órdenes">
      <Card className="p-6">

        {loading && <p>Cargando órdenes...</p>}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">
            No hay órdenes registradas.
          </p>
        )}

        {!loading && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-left text-gray-600">
                  <th className="py-3">ID</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Cambiar estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-medium">
                      #{order.id}
                    </td>

                    <td>
                      ${Number(order.total).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
  onClick={() => openEdit(order.id)}
  className="px-3 py-1 text-sm rounded-full 
             bg-blue-100 text-blue-700 
             hover:bg-blue-200 transition"
>
  Editar
</button>

<button
  onClick={() => handleDelete(order.id)}
  className="px-3 py-1 text-sm rounded-full 
             bg-red-100 text-red-600 
             hover:bg-red-200 transition"
>
  Cancelar
</button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editingOrder && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">
        Editar Pedido #{editingOrder.id}
      </h2>

      {/* SHIPPING */}
      {/* ================= DATOS DE ENVÍO ================= */}
<h3 className="text-md font-semibold text-gray-700 mb-2">
  Datos de envío
</h3>

<div className="space-y-3 mb-6 border p-4 rounded bg-gray-50">
        <input
          className="border p-2 w-full rounded"
          value={editShipping?.full_name || ""}
          placeholder="Nombre"
          onChange={(e) => {
  if (!editShipping) return;

  setEditShipping({
    ...editShipping,
    full_name: e.target.value,
  });
}}
        />
      
        <input
          className="border p-2 w-full rounded"
          value={editShipping?.address || ""}
          placeholder="Dirección"
          onChange={(e) => {
  if (!editShipping) return;

  setEditShipping({
    ...editShipping,
    address: e.target.value,
  });
}}
          
        />

        <input
          className="border p-2 w-full rounded"
          value={editShipping?.phone || ""}
          placeholder="Teléfono"
          onChange={(e) => {
  if (!editShipping) return;

  setEditShipping({
    ...editShipping,
    phone: e.target.value,
  });
}}
          
        />
      </div>

      {/* ================= PRODUCTOS ================= */}
<h3 className="text-md font-semibold text-gray-700 mb-2">
  Detalles del Producto
</h3>

{editItems.map((item, index) => (
  <div key={index} className="border p-3 rounded space-y-2">

    {/* Imagen + Nombre */}
    <div className="flex items-center gap-3">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
      )}
      <span className="font-medium">{item.name}</span>
    </div>

    {/* COLORES DISPONIBLES */}
<div className="mt-3">
  <p className="text-sm font-medium mb-2">Color</p>

  <div className="flex gap-6">
    {[
      { name: "Blanco", value: "white", bg: "bg-white" },
      { name: "Negro", value: "black", bg: "bg-black" },
      { name: "Madera", value: "wood", bg: "bg-yellow-700" },
    ].map((colorOption) => (
      <div
        key={colorOption.value}
        onClick={() => {
          const newItems = [...editItems];
          newItems[index].color = colorOption.value;
          setEditItems(newItems);
        }}
        className="flex items-center gap-2 cursor-pointer group"
      >
        {/* CÍRCULO */}
        <div
  className={` 
    w-5 h-5 rounded-full border-2 transition
    ${colorOption.bg}
    ${
      item.color === colorOption.value
        ? "border-black"
        : "border-gray-300"
    }
  `}
></div>

        {/* NOMBRE AL LADO */}
         <span className="text-sm">
      {colorOption.name}
    </span>
      </div>
    ))}
  </div>
</div>

    {/* Cantidad */}
    <div className="flex justify-end">
      <input
        type="number"
        value={item.quantity}
        className="border p-1 w-20 rounded"
        onChange={(e) => {
          const newItems = [...editItems];
          newItems[index].quantity = Number(e.target.value);
          setEditItems(newItems);
        }}
      />
    </div>

  </div>
))}

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={() => setEditingOrder(null)}
        >
          Cancelar
        </button>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
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