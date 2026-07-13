import { SERVICES_HEADER, SERVICES } from "@/portfolio/data/services";
import SectionHeader from "@/portfolio/components/ui/SectionHeader";
import ServiceCard from "./ServiceCard";

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...SERVICES_HEADER} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
