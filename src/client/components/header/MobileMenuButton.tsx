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
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-raise-br bg-raise text-text-secondary transition-colors duration-200 hover:text-text-primary lg:hidden"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={20} aria-hidden="true" />
      ) : (
        <Menu size={20} aria-hidden="true" />
      )}
    </button>
  );
}
