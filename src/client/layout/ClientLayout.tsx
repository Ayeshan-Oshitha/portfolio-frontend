import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/client/components/header/Header";
import Footer from "@/client/components/footer/Footer";
import ThemeProvider from "@/client/context/ThemeProvider";
import ToastProvider from "@/client/context/ToastProvider";
import CurrencyProvider from "@/client/context/CurrencyProvider";
import ErrorBoundary from "@/client/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: false },
  },
});

export default function ClientLayout() {
  const { pathname } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Inside the query provider — it fetches the currency list. */}
        <CurrencyProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">
              {/* Keyed by path so navigating away from a crashed page remounts the boundary. */}
              <ErrorBoundary key={pathname}>
                <Outlet />
              </ErrorBoundary>
            </main>
            <Footer />
          </ToastProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
