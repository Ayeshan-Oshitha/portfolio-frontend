import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import Button from "@/client/components/ui/Button";
import Chip from "@/client/components/ui/Chip";
import Eyebrow from "@/client/components/ui/Eyebrow";
import IconTile from "@/client/components/ui/IconTile";
import PanelCTA from "@/client/components/ui/PanelCTA";
import Spinner from "@/client/components/ui/Spinner";
import PricingCard from "@/client/components/pricing/PricingCard";
import ServiceCard from "@/client/components/services/ServiceCard";
import FaqSection from "@/client/components/services-page/FaqSection";
import { useService } from "@/client/hooks/useService";
import { useServices } from "@/client/hooks/useServices";
import { mapApiFaqToFaq, mapApiServiceToService } from "@/client/lib/mappers";
import useTheme from "@/client/context/useTheme";
import { findServiceDetail } from "@/client/data/services-page";
import { PRICING_TIERS } from "@/client/data/pricing";

/** Markdown-rendered so a CMS bullet list (`- one\n- two`) becomes a real check-marked list. */
function ChecklistCard({
  eyebrow,
  title,
  markdown,
  theme,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly markdown: string;
  readonly theme: "light" | "dark";
}) {
  return (
    <div className="rounded-[22px] border border-card-br bg-card p-8 shadow-card sm:p-10">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="mb-6 font-display text-[24px] font-medium tracking-[-0.018em] text-text-primary sm:text-[28px]">
        {title}
      </h2>
      <div data-color-mode={theme} className="fw-prose fw-prose-checklist">
        <MDEditor.Markdown
          source={markdown}
          style={{ backgroundColor: "transparent", color: "inherit" }}
        />
      </div>
    </div>
  );
}

/** The service came from the CMS — full page with every section the content model supports. */
function ApiServiceDetail({
  slug,
  theme,
}: {
  readonly slug: string;
  readonly theme: "light" | "dark";
}) {
  const { data: service } = useService(slug);
  const { data: otherServices } = useServices({ pageSize: 4 });

  if (!service) return null;

  const headline = service.headline ?? service.name;
  const deck = service.deck ?? service.shortDescription;
  const primaryCta =
    service.primaryCtaLabel && service.primaryCtaUrl
      ? { label: service.primaryCtaLabel, url: service.primaryCtaUrl }
      : { label: "Book a discovery call", url: "/contact" };
  const secondaryCta =
    service.secondaryCtaLabel && service.secondaryCtaUrl
      ? { label: service.secondaryCtaLabel, url: service.secondaryCtaUrl }
      : { label: "See related work", url: "/work" };

  const relatedServices = (otherServices?.items ?? [])
    .filter((other) => other.id !== service.id)
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="mt-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          {service.eyebrow && <Eyebrow className="mb-5">{service.eyebrow}</Eyebrow>}
          <h1 className="font-display text-[38px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[48px] lg:text-[58px]">
            {headline}
          </h1>
          <p className="mt-5.5 text-[17px] leading-[1.65] text-text-secondary sm:text-[18.5px]">
            {deck}
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Button
              href={primaryCta.url}
              size="lg"
              icon={<ArrowRight size={16} aria-hidden="true" />}
            >
              {primaryCta.label}
            </Button>
            <Button href={secondaryCta.url} variant="secondary" size="lg">
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className="relative h-110 overflow-hidden rounded-[22px] fw-media border border-hair shadow-card">
          {service.heroImageUrl ? (
            <img
              src={service.heroImageUrl}
              alt={service.heroImageAltText ?? ""}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </div>

      {/* Who this is for / what you walk away with */}
      {(service.whoThisIsFor || service.outcomes) && (
        <div className="mt-26 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {service.whoThisIsFor && (
            <ChecklistCard
              eyebrow="Who this is for"
              title="If this sounds familiar, you are in the right place"
              markdown={service.whoThisIsFor}
              theme={theme}
            />
          )}
          {service.outcomes && (
            <ChecklistCard
              eyebrow="What you walk away with"
              title="Results that show up in the business"
              markdown={service.outcomes}
              theme={theme}
            />
          )}
        </div>
      )}

      {/* In depth */}
      {service.inDepth && (
        <div className="mt-24 grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow className="mb-4">In depth</Eyebrow>
            <div data-color-mode={theme} className="fw-prose">
              <MDEditor.Markdown
                source={service.inDepth}
                style={{ backgroundColor: "transparent", color: "inherit" }}
              />
            </div>
          </div>
          {service.depthImageUrl && (
            <div className="overflow-hidden rounded-[22px] border border-hair fw-media shadow-card">
              <img
                src={service.depthImageUrl}
                alt={service.depthImageAltText ?? ""}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* What you get */}
      {service.capabilities && (
        <div className="mt-24">
          <Eyebrow tone="ice" className="mb-4.5">
            What you get
          </Eyebrow>
          <h2 className="mb-10 font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            Capabilities
          </h2>
          <div data-color-mode={theme} className="fw-prose fw-prose-checklist">
            <MDEditor.Markdown
              source={service.capabilities}
              style={{ backgroundColor: "transparent", color: "inherit" }}
            />
          </div>
        </div>
      )}

      {/* Real work */}
      {service.projects && service.projects.length > 0 && (
        <div className="mt-24">
          <Eyebrow tone="ice" className="mb-4.5">
            Real work
          </Eyebrow>
          <h2 className="mb-10 font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
            Projects that show the difference
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.projects.map((project) => (
              <Link
                key={project.id}
                to={`/work/${project.slug}`}
                className="group flex flex-col overflow-hidden rounded-[18px] border border-card-br bg-card shadow-card transition-colors duration-200 hover:border-hair-strong"
              >
                {project.imageUrl && (
                  <div className="aspect-video overflow-hidden fw-media">
                    <img
                      src={project.imageUrl}
                      alt={project.imageAltText ?? ""}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="text-[13px] text-text-muted">{project.year}</span>
                  <h3 className="font-display text-[19px] font-medium tracking-[-0.018em] text-text-primary">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-[14px] leading-[1.6] text-text-secondary">
                    {project.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other services */}
      {relatedServices.length > 0 && (
        <div className="mt-24">
          <Eyebrow className="mb-4.5">More services</Eyebrow>
          <h2 className="mb-10 font-display text-[28px] font-medium tracking-[-0.018em] text-text-primary">
            Other ways I can help
          </h2>
          <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
            {relatedServices.map((other) => (
              <ServiceCard key={other.id} service={mapApiServiceToService(other)} />
            ))}
          </div>
        </div>
      )}

      {/* This service's own FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="mt-26">
          <FaqSection faqs={service.faqs.map(mapApiFaqToFaq)} />
        </div>
      )}
    </>
  );
}

/** Curated static entry — kept while not every service lives in the CMS yet. */
function StaticServiceDetail({ slug }: { readonly slug: string }) {
  const service = findServiceDetail(slug);

  if (!service) return null;

  const tiers = PRICING_TIERS.filter((tier) =>
    service.relevantTiers.includes(tier.id),
  );

  return (
    <>
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
            <g opacity="0.5" stroke="currentColor" fill="none" strokeWidth="1.3">
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
    </>
  );
}

/**
 * A service either lives in the CMS (`ApiServiceDetail`, the long-term path)
 * or is still one of the curated static entries in `services-page.ts` — the
 * static list is checked only once the API confirms there's nothing
 * published under this slug, so a slug that exists in both never renders the
 * stale static copy.
 */
export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: apiService, isPending, isError } = useService(slug);
  const { theme } = useTheme();

  const staticService = slug ? findServiceDetail(slug) : undefined;

  if (isPending) {
    return (
      <div className="flex justify-center pt-48 pb-24 text-text-muted">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const foundInApi = !isError && apiService;

  if (!foundInApi && !staticService) {
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

  const title = foundInApi
    ? (apiService.headline ?? apiService.name)
    : staticService!.title;

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
          <span className="font-semibold text-text-primary">{title}</span>
        </nav>

        {foundInApi ? (
          <ApiServiceDetail slug={slug!} theme={theme} />
        ) : (
          <StaticServiceDetail slug={slug!} />
        )}

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
