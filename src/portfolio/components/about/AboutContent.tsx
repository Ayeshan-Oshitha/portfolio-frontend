import { ArrowRight } from "lucide-react";
import Button from "@/portfolio/components/ui/Button";
import type { AboutData } from "@/portfolio/types";

interface AboutContentProps {
  readonly data: AboutData;
}

export default function AboutContent({ data }: AboutContentProps) {
  return (
    <div className="flex flex-col justify-center">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary-600/10 text-primary-400 border border-primary-600/20 w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
        {data.badge}
      </span>

      {/* Headline */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-2">
        <span className="text-text-primary">{data.greeting} </span>
        <br />
        <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
          {data.name}
        </span>
      </h2>

      {/* Role */}
      <p className="text-xl sm:text-2xl font-bold text-primary-400 mb-1">
        {data.role}
      </p>

      {/* Location */}
      <p className="text-sm text-text-muted mb-8">{data.location}</p>

      {/* Bio */}
      <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6 max-w-lg">
        {data.bio}
      </p>

      {/* Closing quote */}
      <p className="text-sm text-text-muted italic mb-10 max-w-lg">
        //{data.closingQuote}
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Button
          href={data.primaryCta.href}
          variant="primary"
          size="lg"
          icon={<ArrowRight size={18} />}
          className="uppercase tracking-wider text-xs"
        >
          {data.primaryCta.label}
        </Button>
        <Button
          href={data.secondaryCta.href}
          variant="outline"
          size="lg"
          className="uppercase tracking-wider text-xs"
        >
          {data.secondaryCta.label}
        </Button>
      </div>
    </div>
  );
}
