import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !["admin", "superadmin"].includes(user.role))
    return <Navigate to="/" replace />;

  return <Outlet />;
}