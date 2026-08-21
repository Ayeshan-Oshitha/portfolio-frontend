import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/client/components/ui/Spinner";
import useAuth from "@/admin/context/useAuth";

export default function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-400">
        <Spinner className="h-8 w-8" label="Checking your session" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
