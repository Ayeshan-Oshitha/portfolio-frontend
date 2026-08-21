import { Link, Outlet } from "react-router-dom";
import Alert from "@/admin/components/ui/Alert";
import Card from "@/admin/components/ui/Card";
import useAuth from "@/admin/context/useAuth";

/**
 * User management is `SuperAdmin`-only server-side (`UserService`), so this
 * keeps a regular `Admin` from seeing the table and hitting a raw `forbidden`
 * error on click. Assumes an auth guard already ran higher up the tree.
 */
export default function RequireSuperAdmin() {
  const { user } = useAuth();

  if (user?.role !== "super_admin") {
    return (
      <div className="max-w-md">
        <Card>
          <Alert>Only the super admin can manage users.</Alert>
          <Link
            to="/admin"
            className="mt-6 inline-block text-sm text-primary-400 hover:text-primary-300 font-medium"
          >
            Back to dashboard
          </Link>
        </Card>
      </div>
    );
  }

  return <Outlet />;
}
