import Hero from "@/client/components/hero/Hero";
import TrustedBy from "@/client/components/trusted-by/TrustedBy";
import Services from "@/client/components/services/Services";
import Metrics from "@/client/components/metrics/Metrics";
import Pricing from "@/client/components/pricing/Pricing";
import TestimonialCarousel from "@/client/components/testimonial/TestimonialCarousel";
import PanelCTA from "@/client/components/ui/PanelCTA";
import { HOME_METRICS } from "@/client/data/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Services />
      <Metrics metrics={HOME_METRICS} />
      <Pricing />
      <TestimonialCarousel />

      <section className="mx-auto max-w-7xl px-4 py-26 sm:px-6 lg:px-8">
        <PanelCTA
          align="center"
          title={
            <>
              Let&rsquo;s build something
              <br />
              that lasts a decade.
            </>
          }
          description="Tell us what you're building. You'll get a scoped proposal and a fixed price within three working days."
          primaryLabel="Start a project"
          primaryHref="/contact"
          secondaryLabel="See our work"
          secondaryHref="/work"
        />
      </section>
    </>
  );
}
