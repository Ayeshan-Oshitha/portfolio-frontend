interface HeroDescriptionProps {
  readonly text: string;
}

export default function HeroDescription({ text }: HeroDescriptionProps) {
  return (
    <p
      className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed animate-fade-in-up"
      style={{ animationDelay: "300ms" }}
    >
      {text}
    </p>
  );
}
