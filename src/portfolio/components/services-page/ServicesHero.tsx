export default function ServicesHero() {
  return (
    <div className="mb-20 text-center sm:text-left relative">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full pointer-events-none" />
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-text-primary mb-6 relative z-10">
        Expertise &{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
          Services
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl relative z-10">
        Comprehensive software development solutions tailored to solve complex
        business challenges and drive digital transformation.
      </p>
    </div>
  );
}
