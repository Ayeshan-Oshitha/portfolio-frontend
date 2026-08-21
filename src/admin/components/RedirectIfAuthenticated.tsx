import { Navigate, Outlet } from "react-router-dom";
import Spinner from "@/portfolio/components/ui/Spinner";
import useAuth from "@/admin/context/useAuth";

/** Keeps signed-in users off the login and register screens. */
export default function RedirectIfAuthenticated() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-primary-400">
        <Spinner className="h-8 w-8" label="Checking your session" />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
