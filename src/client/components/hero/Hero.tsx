import HeroBadge from "./HeroBadge";
import HeroHeadline from "./HeroHeadline";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";
import ProductShowcase from "./ProductShowcase";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient light — the aurora behind the headline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-85 left-1/2 h-225 w-[1500px] -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-30 -left-70 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 pt-20 text-center sm:pt-28">
          <HeroBadge />
          <HeroHeadline />
          <HeroDescription />
          <HeroActions />
        </div>

        <div className="mt-16 sm:mt-18">
          <ProductShowcase />
        </div>
      </div>
    </section>
  );
}
