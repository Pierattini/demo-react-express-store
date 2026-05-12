import { useState, useEffect, type ReactNode } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart as clearCartStorage,
  checkout as checkoutApi,
  type CartItem,
} from "../lib/cart";

import { CartContext, type ShippingData } from "./CartContext";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => getCart());

  const sync = () => setItems(getCart());

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const clear = () => {
    clearCartStorage();
    setItems([]);
  };

  const checkout = async (data: ShippingData) => {
    const response = await checkoutApi({
      items,
      shippingData: {
        full_name: data.full_name,
        address: data.address,
        phone: data.phone,
        notes: data.notes,
      },
      paymentMethod: data.paymentMethod,
    });

    clear();
    return response;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        add: (id, q = 1, color) => {
          addToCart(id, q, color);
          sync();
        },
        update: (id, q, colorHex) => {
          updateCartItem(id, q, colorHex);
          sync();
        },
        remove: (id, colorHex) => {
          removeFromCart(id, colorHex);
          sync();
        },
        clear,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}