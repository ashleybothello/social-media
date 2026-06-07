import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "@/store/auth-store";

export default function ProtectedRoute() {
  const token = getAuthToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
