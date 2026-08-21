import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-primary-400">
            Portfolio CMS
          </p>
          <h1 className="mt-2 text-2xl font-bold text-text-primary">
            Admin access
          </h1>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
