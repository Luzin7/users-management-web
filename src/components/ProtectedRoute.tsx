import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const ProtectedRoute= ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user } = useUserStore();
  const { accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
