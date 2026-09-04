import { Outlet } from "react-router-dom";
import Card from "@/admin/components/ui/Card";
import BrandMark from "./BrandMark";

/**
 * Shell for the signed-out screens (sign in, register, password reset).
 *
 * The card lives here rather than in each page, so the six auth screens stay
 * identically framed. The wash behind it is a plain radial on a pinned admin
 * token — deliberately not one of the client's `fw-amb-*` gradient utilities,
 * which read `:root`-scoped custom properties the admin theme block cannot
 * override and so would flip with the visitor's theme.
 */
export default function AuthLayout() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,var(--color-primary-50),transparent_70%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandMark size="lg" iconOnly />
          <h1 className="mt-5 admin-display text-[2rem] leading-[1.05] text-text-primary">
            Admin access
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            FrostWoodTech content management
          </p>
        </div>

        <Card>
          <Outlet />
        </Card>
      </div>
    </main>
  );
}
