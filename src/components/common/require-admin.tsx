import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/lib/auth";

export function RequireAdmin({ children }: { children?: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  if (!user.is_admin) {
    return <Navigate to="/my-record" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}