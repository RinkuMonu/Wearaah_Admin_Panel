import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context";

export const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
