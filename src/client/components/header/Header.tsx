import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import HeaderActions from "./HeaderActions";
import MobileMenuButton from "./MobileMenuButton";
import MobileNav from "./MobileNav";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div
          className={`flex items-center justify-between h-[68px] px-3 sm:px-5 rounded-full border transition-shadow duration-300 bg-[#1f202c] border-[#2a2b45] ${
            isScrolled
              ? "shadow-2xl shadow-black/60"
              : "shadow-lg shadow-black/30"
          }`}
        >
          {/* Part 1: Logo — Left */}
          <Logo />

          {/* Part 2: Nav Links — Absolutely centered */}
          <DesktopNav />

          {/* Part 3: Icons + CTA — Right */}
          <HeaderActions />

          {/* Mobile menu button (shown on smaller screens only) */}
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onToggle={handleToggleMobileMenu}
          />
        </div>
      </div>

      <div className="pointer-events-auto">
        <MobileNav isOpen={isMobileMenuOpen} onClose={handleCloseMobileMenu} />
      </div>
    </header>
  );
}
