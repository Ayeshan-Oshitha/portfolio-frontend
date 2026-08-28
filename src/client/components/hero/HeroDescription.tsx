import { HERO_DATA } from "@/client/data/hero";

export default function HeroDescription() {
  return (
    <p className="max-w-xl text-lg leading-[1.62] text-text-secondary sm:text-[19.5px]">
      {HERO_DATA.description}
    </p>
  );
}
