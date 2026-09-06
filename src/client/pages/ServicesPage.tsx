import ServicesHero from "@/client/components/services-page/ServicesHero";
import ServiceGrid from "@/client/components/services-page/ServiceGrid";
import Process from "@/client/components/services-page/Process";
import FaqSection from "@/client/components/services-page/FaqSection";
import PanelCTA from "@/client/components/ui/PanelCTA";
import { useFaqs } from "@/client/hooks/useFaqs";
import { mapApiFaqToFaq } from "@/client/lib/mappers";

export default function ServicesPage() {
  const { data: apiFaqs, isPending, isError } = useFaqs();
  // Falls back to the static FAQ_DATA (FaqSection's own default) while
  // loading, on error, or once nothing published exists yet.
  const faqs =
    !isPending && !isError && apiFaqs && apiFaqs.length > 0
      ? apiFaqs.map(mapApiFaqToFaq)
      : undefined;

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-195 w-275 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-15 -left-80 h-195 w-195 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-26 px-4 pt-23 pb-26 sm:px-6 lg:px-8">
        <ServicesHero />
        <ServiceGrid />
        <Process />
        <FaqSection faqs={faqs} />

        <PanelCTA
          title="Not sure which one you need?"
          description="Book a free 30-minute call. We will map the right build for your goals — and tell you honestly if we are not the right fit."
          primaryLabel="Book a discovery call"
          primaryHref="/contact"
        />
      </div>
    </div>
  );
}
