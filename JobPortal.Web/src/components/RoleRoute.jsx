import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allow = [] }) {
  const { user } = useAuth();

  if (!user?.role) return <Navigate to="/login" replace />;

  const ok = allow.includes(user.role);
  if (!ok) return <Navigate to="/" replace />;

  return <Outlet />;
}
