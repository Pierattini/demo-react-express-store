import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function RequireAdmin({ children }: Props) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

