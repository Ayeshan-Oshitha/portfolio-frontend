import { HERO_DATA } from "@/client/data/hero";

export default function HeroHeadline() {
  return (
    <h1 className="max-w-5xl font-display text-[44px] leading-[1.02] font-medium tracking-[-0.018em] text-text-primary sm:text-[64px] lg:text-[88px]">
      {HERO_DATA.headlineLead}
      <span className="fw-text-ice">{HERO_DATA.headlineIce}</span>
      {HERO_DATA.headlineMid}
      <span className="fw-text-forest">{HERO_DATA.headlineForest}</span>
      {HERO_DATA.headlineTail}
    </h1>
  );
}
