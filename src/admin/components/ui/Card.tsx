interface CardProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-surface-900/60 border border-border-subtle shadow-sm p-8 ${className}`}
    >
      {children}
    </div>
  );
}
