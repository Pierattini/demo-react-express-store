// src/lib/cart.ts
import { httpPost } from "./http";


/* ======================================================
   TIPOS
====================================================== */
export type CartItem = {
  product_id: number;
  quantity: number;
  color_hex?: string;
  color_name?: string;
};

export type CartColor = {
  hex?: string;
  name?: string;
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

function normalizeColorHex(hex?: string) {
  return (hex || "").trim().toLowerCase();
}

function sameVariant(item: CartItem, productId: number, colorHex?: string) {
  return (
    item.product_id === productId &&
    normalizeColorHex(item.color_hex) === normalizeColorHex(colorHex)
  );
}

/* ======================================================
   API DEL CARRITO (PUBLICA)
====================================================== */

// obtener items
export function getCart(): CartItem[] {
  return readCart();
}

// agregar producto
export function addToCart(product_id: number, quantity = 1, color?: CartColor) {
  const cart = readCart();
  const colorHex = normalizeColorHex(color?.hex);
  const colorName = color?.name?.trim();

  const existing = cart.find((item) => sameVariant(item, product_id, colorHex));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      product_id,
      quantity,
      ...(colorHex ? { color_hex: colorHex } : {}),
      ...(colorName ? { color_name: colorName } : {}),
    });
  }

  saveCart(cart);
}

// actualizar cantidad
export function updateCartItem(
  product_id: number,
  quantity: number,
  colorHex?: string
) {
  const cart = readCart();

  const item = cart.find((i) => sameVariant(i, product_id, colorHex));

  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(product_id, colorHex);
    return;
  }

  item.quantity = quantity;
  saveCart(cart);
}

// eliminar item
export function removeFromCart(product_id: number, colorHex?: string) {
  const cart = readCart().filter(
    (i) => !sameVariant(i, product_id, colorHex)
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
  const normalizedItems = data.items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    ...(item.color_name || item.color_hex
      ? { color: item.color_name || item.color_hex }
      : {}),
  }));

  return httpPost<CheckoutResponse>(
    "/orders",
    {
      items: normalizedItems,
      shipping: data.shippingData,
      payment_method: data.paymentMethod,
    },
    false
  );
}