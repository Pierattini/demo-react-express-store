import { createContext } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};


export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
