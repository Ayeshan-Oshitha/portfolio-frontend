interface IconTileProps {
  readonly children: React.ReactNode;
  readonly size?: "sm" | "md";
  readonly className?: string;
}

const SIZE_CLASSES: Record<"sm" | "md", string> = {
  sm: "w-[34px] h-[34px] rounded-[9px]",
  md: "w-11 h-11 rounded-xl",
};

/** The tinted square that sits above every service / feature card. */
export default function IconTile({
  children,
  size = "md",
  className = "",
}: IconTileProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center fw-icon-bg border border-hair text-icon-fg ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </div>
  );
}
