export interface ProductColor {
  name?: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: number;

  name: string;
  name_en?: string;

  description: string;
  description_en?: string;

  price: number;
  stock: number;

  image: string;

  colors?: ProductColor[];

  active: boolean;
  created_at: string;

  featured?: boolean;
}

/* ===============================
   USER TYPES
================================= */

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}