import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function RequireGuest({ children }: Props) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
