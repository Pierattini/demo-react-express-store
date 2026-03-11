import { http } from "./http";

/* ======================================================
   TYPES
====================================================== */

export type OrderItem = {
  product_id: number;
  name: string;          // 🟢 viene del backend
  image_url?: string;    // 🟢 viene del backend
  quantity: number;
  price: number;
  color?: string;
};

export type Order = {
  id: number;
  user_id: number;
  status: string;
  total: number;
  created_at: string;

  // 🟢 MÉTODO DE PAGO
  payment_method?: "bank_transfer" | "stripe";

  // 🟢 SHIPPING
  full_name?: string;
  address?: string;
  phone?: string;
  notes?: string;

  // 🟢 DATOS BANCARIOS (si es transferencia)
  bankDetails?: {
    bank_name: string;
    bank_account: string;
    bank_holder: string;
  } | null;

  items: OrderItem[];
};

/* ======================================================
   USER ENDPOINTS
====================================================== */

export function getMyOrders() {
  return http<Order[]>("/orders/my");
}

export function getOrderById(id: number) {
  return http<Order>(`/orders/${id}`);
}

/* ======================================================
   ADMIN ENDPOINTS
====================================================== */

export function getAllOrders() {
  return http<Order[]>("/orders");
}

export function updateOrderStatus(
  id: number,
  status: string
) {
  return http<Order>(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
/* ======================================================
   ADMIN - UPDATE ORDER
====================================================== */

export function updateOrder(
  id: number,
  data: {
    items: OrderItem[];
    shipping: {
      full_name: string;
      address: string;
      phone: string;
      notes?: string;
    };
  }
) {
  return http(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}