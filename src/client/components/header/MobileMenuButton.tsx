import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

export default function MobileMenuButton({
  isOpen,
  onToggle,
}: MobileMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-800/50 transition-colors duration-200 cursor-pointer"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  );
}
