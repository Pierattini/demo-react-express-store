import { createContext } from "react";
import type { CartItem } from "../lib/cart";

export type PaymentMethod = "bank_transfer" | "stripe";

export type ShippingData = {
  full_name: string;
  address: string;
  phone: string;
  notes?: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutResponse = {
  message: string;
  order: {
    id: number;
    total: number;
    status: string;
  };
  bankDetails?: {
    bank_name: string;
    bank_account: string;
    bank_holder: string;
  } | null;
  url?: string;
};

export type CartContextType = {
  items: CartItem[];
  add: (productId: number, quantity?: number) => void;
  update: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  checkout: (data: ShippingData) => Promise<CheckoutResponse>;
};

export const CartContext = createContext<CartContextType | null>(null);