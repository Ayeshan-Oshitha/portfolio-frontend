import ServicesHero from "../components/services-page/ServicesHero";
import ServiceOfferings from "../components/services-page/ServiceOfferings";
import RelatedWork from "../components/services-page/RelatedWork";
import FaqSection from "../components/services-page/FaqSection";

export default function ServicesPage() {
  return (
    <div className="relative pt-32 pb-24 sm:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServicesHero />
        <ServiceOfferings />

        {/* Divider before Related Work */}
        <div className="w-full h-px bg-border-subtle mb-32" />

        <RelatedWork />
        <FaqSection />
      </div>
    </div>
  );
}
