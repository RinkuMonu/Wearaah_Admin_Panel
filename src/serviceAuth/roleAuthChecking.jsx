import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context";

export const RoleProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useAuth();
  // console.log(user?.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div className="text-center mt-10">Checking access...</div>;
  }

  if (!allowedRoles.includes(user?.user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
