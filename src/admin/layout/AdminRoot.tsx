import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "@/admin/context/AuthProvider";
import ToastProvider from "@/admin/context/ToastProvider";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: false },
  },
});

/** Route element for `/admin` — scopes auth state and query cache to the CMS subtree. */
export default function AdminRoot() {
  useDocumentTitle("FrostWoodTech CMS");

  return (
    <div
      data-theme="admin-light"
      className="min-h-screen bg-surface-950 text-text-primary"
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </ToastProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}
