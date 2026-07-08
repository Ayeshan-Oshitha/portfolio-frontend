import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";
import type { CtaConfig } from "../../types";

interface HeroActionsProps {
  readonly primaryCta: CtaConfig;
  readonly secondaryCta: CtaConfig;
}

export default function HeroActions({
  primaryCta,
  secondaryCta,
}: HeroActionsProps) {
  return (
    <div
      className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
      style={{ animationDelay: "450ms" }}
    >
      <Button
        href={primaryCta.href}
        size="lg"
        variant="primary"
        icon={<ArrowRight size={18} />}
        className="uppercase tracking-wider text-xs"
      >
        {primaryCta.label}
      </Button>
      <Button
        href={secondaryCta.href}
        size="lg"
        variant="outline"
        className="uppercase tracking-wider text-xs"
      >
        {secondaryCta.label}
      </Button>
    </div>
  );
}
