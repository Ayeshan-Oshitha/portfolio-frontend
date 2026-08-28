import ServiceCard from "@/client/components/services/ServiceCard";
import { SERVICES } from "@/client/data/services";

export default function ServiceGrid() {
  return (
    <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
