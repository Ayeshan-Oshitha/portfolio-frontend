import { HERO_DATA } from "../../data/hero";
import HeroBadge from "./HeroBadge";
import HeroHeadline from "./HeroHeadline";
import HeroDescription from "./HeroDescription";
import HeroActions from "./HeroActions";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-screen pt-[73px] overflow-hidden"
      aria-label="Hero"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Center radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-600/8 rounded-full blur-[120px]" />
        {/* Top-right accent glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px]" />
        {/* Bottom-left accent glow */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center gap-8">
          <HeroBadge text={HERO_DATA.badge} />
          <HeroHeadline
            primary={HERO_DATA.headlinePrimary}
            highlight={HERO_DATA.headlineHighlight}
            suffix={HERO_DATA.headlineSuffix}
          />
          <HeroDescription text={HERO_DATA.description} />
          <HeroActions
            primaryCta={HERO_DATA.primaryCta}
            secondaryCta={HERO_DATA.secondaryCta}
          />
        </div>
      </div>

      {/* Bottom fade gradient to blend into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
