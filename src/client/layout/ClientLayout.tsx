import { Outlet } from "react-router-dom";
import Header from "@/client/components/header/Header";
import Footer from "@/client/components/footer/Footer";

export default function ClientLayout() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
