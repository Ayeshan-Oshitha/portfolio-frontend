import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/client/components/header/Header";
import Footer from "@/client/components/footer/Footer";
import ToastProvider from "@/client/context/ToastProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: false },
  },
});

export default function ClientLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Header />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <Footer />
      </ToastProvider>
    </QueryClientProvider>
  );
}
