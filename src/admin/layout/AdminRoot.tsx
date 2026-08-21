import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "@/admin/context/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: false },
  },
});

/** Route element for `/admin` — scopes auth state and query cache to the CMS subtree. */
export default function AdminRoot() {
  return (
    <div
      data-theme="admin-light"
      className="min-h-screen bg-surface-950 text-text-primary"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}
