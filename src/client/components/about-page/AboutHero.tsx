import Eyebrow from "@/client/components/ui/Eyebrow";
import { ABOUT_HERO } from "@/client/data/about";

export default function AboutHero() {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <Eyebrow align="center" className="mb-5">
        {ABOUT_HERO.badge}
      </Eyebrow>
      <h1 className="font-display text-[40px] leading-[1.06] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary sm:text-[54px] lg:text-[66px]">
        {ABOUT_HERO.title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-[1.62] text-text-secondary sm:text-[19px]">
        {ABOUT_HERO.description}
      </p>
    </div>
  );
}
