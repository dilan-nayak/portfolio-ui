import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/admin/context/AdminAuthContext";

const RequireAdmin = () => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        Checking admin session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default RequireAdmin;
