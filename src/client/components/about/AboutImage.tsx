interface AboutImageProps {
  readonly src: string;
  readonly alt: string;
}

export default function AboutImage({ src, alt }: AboutImageProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow effect behind image */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-500/10 rounded-3xl blur-2xl scale-95"
        aria-hidden="true"
      />

      {/* Image container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary-500/20 shadow-2xl shadow-primary-600/10 max-w-md w-full aspect-[3/4]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Subtle overlay gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-surface-950/30 via-transparent to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
