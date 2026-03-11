// src/lib/cart.ts
import { httpPost } from "./http";


/* ======================================================
   TIPOS
====================================================== */
export type CartItem = {
  product_id: number;
  quantity: number;
};

export type CheckoutResponse = {
  message: string;
  order: {
    id: number;
    total: number;
    status: string;
  };
};

const CART_KEY = "cart";

/* ======================================================
   STORAGE HELPERS
====================================================== */
function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/* ======================================================
   API DEL CARRITO (PUBLICA)
====================================================== */

// obtener items
export function getCart(): CartItem[] {
  return readCart();
}

// agregar producto
export function addToCart(product_id: number, quantity = 1) {
  const cart = readCart();

  const existing = cart.find(
    (item) => item.product_id === product_id
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product_id, quantity });
  }

  saveCart(cart);
}

// actualizar cantidad
export function updateCartItem(
  product_id: number,
  quantity: number
) {
  const cart = readCart();

  const item = cart.find(
    (i) => i.product_id === product_id
  );

  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(product_id);
    return;
  }

  item.quantity = quantity;
  saveCart(cart);
}

// eliminar item
export function removeFromCart(product_id: number) {
  const cart = readCart().filter(
    (i) => i.product_id !== product_id
  );
  saveCart(cart);
}

// vaciar carrito
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

/* ======================================================
   CHECKOUT (BACKEND)
====================================================== */

export async function checkout(data: {
  items: CartItem[];
  shippingData: {
    full_name: string;
    address: string;
    phone: string;
    notes?: string;
  };
  paymentMethod: "bank_transfer" | "stripe"; // ✅ aquí
}): Promise<CheckoutResponse> {
  return httpPost<CheckoutResponse>(
    "/orders",
    {
      items: data.items,
      shipping: data.shippingData,
      payment_method: data.paymentMethod,
    },
    false
  );
}