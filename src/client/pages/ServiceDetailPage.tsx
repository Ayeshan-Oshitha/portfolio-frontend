import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Button from "@/client/components/ui/Button";
import Chip from "@/client/components/ui/Chip";
import Eyebrow from "@/client/components/ui/Eyebrow";
import IconTile from "@/client/components/ui/IconTile";
import PanelCTA from "@/client/components/ui/PanelCTA";
import PricingCard from "@/client/components/pricing/PricingCard";
import FaqSection from "@/client/components/services-page/FaqSection";
import { findServiceDetail } from "@/client/data/services-page";
import { PRICING_TIERS } from "@/client/data/pricing";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = findServiceDetail(slug);

  if (!service) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-40 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-[40px] font-medium text-text-primary">
          Service not found
        </h1>
        <p className="mt-4 text-text-secondary">
          That service does not exist — here is everything we do.
        </p>
        <Button href="/services" className="mt-8">
          View all services
        </Button>
      </div>
    );
  }

  const tiers = PRICING_TIERS.filter((tier) =>
    service.relevantTiers.includes(tier.id),
  );

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/3 h-200 w-300 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-100 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto max-w-7xl px-4 pt-8 pb-26 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2.5 text-[13.5px] text-text-muted"
        >
          <Link to="/services" className="hover:text-text-primary">
            Services
          </Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="font-semibold text-text-primary">
            {service.title}
          </span>
        </nav>

        {/* Hero */}
        <div className="mt-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-5">Service</Eyebrow>
            <h1 className="font-display text-[38px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[48px] lg:text-[58px]">
              {service.title}
            </h1>
            <p className="mt-5.5 text-[17px] leading-[1.65] text-text-secondary sm:text-[18.5px]">
              {service.deck}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button
                href="/contact"
                size="lg"
                icon={<ArrowRight size={16} aria-hidden="true" />}
              >
                Book a discovery call
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                See related work
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap gap-10 border-t border-hair pt-7">
              {service.stats.map((stat) => (
                <div key={stat.id}>
                  <div className="font-display text-[28px] leading-none font-medium tabular-nums text-text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[13px] text-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-110 overflow-hidden rounded-[22px] fw-media border border-hair shadow-card">
            <svg
              viewBox="0 0 620 440"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 h-full w-full text-media-fg"
              aria-hidden="true"
            >
              <g
                opacity="0.5"
                stroke="currentColor"
                fill="none"
                strokeWidth="1.3"
              >
                <rect x="60" y="60" width="500" height="320" rx="16" />
                <path d="M60 116h500M180 116v264" />
                <rect x="86" y="146" width="68" height="10" rx="4" />
                <rect x="86" y="176" width="68" height="10" rx="4" />
                <rect x="86" y="206" width="68" height="10" rx="4" />
                <rect x="86" y="236" width="68" height="10" rx="4" />
                <rect x="210" y="146" width="100" height="66" rx="9" />
                <rect x="326" y="146" width="100" height="66" rx="9" />
                <rect x="442" y="146" width="90" height="66" rx="9" />
                <rect x="210" y="240" width="322" height="120" rx="10" />
                <path d="M210 340 L268 300 L326 316 L384 268 L442 288 L500 250" />
              </g>
            </svg>
          </div>
        </div>

        {/* What's included */}
        <div className="mt-26">
          <Eyebrow tone="ice" className="mb-4.5">
            What&rsquo;s included
          </Eyebrow>
          <h2 className="mb-10 font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            Everything a real product needs
            <br className="hidden sm:block" /> on day one.
          </h2>

          <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
            {service.included.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex gap-4.5 rounded-[18px] border border-card-br bg-card p-8 shadow-card"
                >
                  <IconTile>
                    <Icon size={19} aria-hidden="true" />
                  </IconTile>
                  <div>
                    <h3 className="font-display text-[19px] font-medium tracking-[-0.018em] text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-[1.65] text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stack */}
        <div className="mt-24 rounded-[22px] border border-card-br bg-card p-9 shadow-card sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-[26px] font-medium tracking-[-0.018em] text-text-primary sm:text-[30px]">
                The stack we reach for
              </h2>
              <p className="mt-2.5 max-w-lg text-[15.5px] leading-[1.65] text-text-secondary">
                Boring, well-documented tools with long support horizons. We
                will use yours instead if you already have a team.
              </p>
            </div>
            <div className="shrink-0 sm:text-right">
              <div className="font-display text-[38px] leading-none font-medium tabular-nums text-text-primary">
                100%
              </div>
              <div className="mt-1 text-[13px] text-text-muted">
                TypeScript, end to end
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {service.stack.map((tool) => (
              <Chip key={tool}>{tool}</Chip>
            ))}
          </div>
        </div>

        {/* Cost */}
        {tiers.length > 0 && (
          <div className="mt-24">
            <div className="mx-auto mb-11 max-w-xl text-center">
              <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
                What it costs
              </h2>
              <p className="mt-3.5 text-[16.5px] leading-relaxed text-text-secondary">
                Both routes start with the same free scoping call and end with a
                fixed-price proposal.
              </p>
            </div>

            <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-5 md:grid-cols-2">
              {tiers.map((tier) => (
                <PricingCard key={tier.id} tier={tier} />
              ))}
            </div>

            <p className="mt-8 text-center text-[14px] text-text-muted">
              <Link to="/pricing" className="font-semibold hover:underline">
                Compare every tier in detail
              </Link>
            </p>
          </div>
        )}

        <div className="mt-26">
          <FaqSection />
        </div>

        <div className="mt-24">
          <PanelCTA
            title="Have a project in mind?"
            description="Thirty minutes, no pitch deck. You will leave with a scope, a timeline and a number."
            primaryLabel="Book a discovery call"
            primaryHref="/contact"
          />
        </div>
      </div>
    </div>
  );
}
