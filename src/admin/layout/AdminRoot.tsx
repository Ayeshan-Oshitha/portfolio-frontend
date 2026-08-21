import { Outlet } from "react-router-dom";
import AuthProvider from "@/admin/context/AuthProvider";

/** Route element for `/admin` — scopes auth state to the CMS subtree. */
export default function AdminRoot() {
  return (
    <div
      data-theme="admin-light"
      className="min-h-screen bg-surface-950 text-text-primary"
    >
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </div>
  );
}
