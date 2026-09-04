import { ArrowRight, Check } from "lucide-react";
import Button from "@/client/components/ui/Button";
import { HERO_DATA } from "@/client/data/hero";

export default function HeroActions() {
  return (
    <div className="flex flex-col items-center gap-6.5">
      <div className="flex flex-col gap-3.5 sm:flex-row">
        <Button
          href={HERO_DATA.primaryCta.href}
          size="lg"
          icon={<ArrowRight size={16} aria-hidden="true" />}
        >
          {HERO_DATA.primaryCta.label}
        </Button>
        <Button
          href={HERO_DATA.secondaryCta.href}
          variant="secondary"
          size="lg"
        >
          {HERO_DATA.secondaryCta.label}
        </Button>
      </div>

      <p className="flex items-center gap-2.5 text-center text-[13.5px] text-text-muted">
        <Check
          size={15}
          className="shrink-0 text-primary-400"
          aria-hidden="true"
        />
        {HERO_DATA.trustLine}
      </p>
    </div>
  );
}
