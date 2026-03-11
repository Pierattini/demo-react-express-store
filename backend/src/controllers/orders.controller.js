import { getBankDetails } from "../services/orders.service.js";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrderService,
  updateOrder
} from "../services/orders.service.js";
/* ======================
   POST /orders (USER)
====================== */
export async function createOrderController(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const { items, shipping, payment_method } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items inválidos" });
    }

    if (!shipping || !shipping.full_name || !shipping.address || !shipping.phone) {
      return res.status(400).json({ message: "Datos de envío inválidos" });
    }

    const allowed = ["bank_transfer", "stripe"];
    if (!payment_method || !allowed.includes(payment_method)) {
      return res.status(400).json({ message: "Método de pago inválido" });
    }

    const order = await createOrder(userId, items, shipping, payment_method);

    if (payment_method === "bank_transfer") {
      const bankDetails = await getBankDetails();

      return res.status(201).json({
        message: "Pedido creado. Pendiente de transferencia.",
        order,
        bankDetails,
      });
    }

    return res.status(201).json({
      message: "Pedido creado. Pendiente de pago con tarjeta.",
      order,
    });

  } catch (error) {
    next(error);
  }
}

/* ======================
   GET /orders/my (USER)
====================== */
export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

/* ======================
   GET /orders/:id (USER / ADMIN)
====================== */
export async function getOrderDetail(req, res, next) {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    if (req.user.role !== "admin" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

/* ======================
   GET /orders (ADMIN)
====================== */
export async function getAllOrdersController(req, res, next) {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

/* ======================
   PUT /orders/:id/status (ADMIN)
====================== */
export async function changeOrderStatusController(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/* ======================
   PUT /orders/:id/cancel (ADMIN)
====================== */
export async function cancelOrderController(req, res, next) {
  try {
    await cancelOrder(req.params.id);
    res.json({ message: "Pedido cancelado y stock devuelto" });
  } catch (error) {
    next(error);
  }
}
export const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteOrderService(id); // función que borra en DB

    res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando orden" });
  }
};

export async function updateOrderController(req, res, next) {
  try {
    const { items, shipping } = req.body;

    await updateOrder(req.params.id, items, shipping);

    res.json({ message: "Pedido actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};
