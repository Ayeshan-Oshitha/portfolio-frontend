import { Outlet } from "react-router-dom";
import Header from "@/portfolio/components/header/Header";
import Footer from "@/portfolio/components/footer/Footer";

export default function PortfolioLayout() {
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
