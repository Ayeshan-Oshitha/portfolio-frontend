import ServiceCard from "@/client/components/services/ServiceCard";
import { useServices } from "@/client/hooks/useServices";
import { mapApiServiceToService } from "@/client/lib/mappers";
import { SERVICES } from "@/client/data/services";

const PAGE_SIZE = 20;

/**
 * Falls back to the static curated list while loading and on error, rather
 * than showing an empty grid — the six static entries are the intended
 * long-term catalog anyway, kept in sync by hand until every service that
 * matters is published through the CMS.
 */
export default function ServiceGrid() {
  const { data: result, isPending, isError } = useServices({
    pageSize: PAGE_SIZE,
  });

  // Also falls back once the request resolves with nothing published yet —
  // an empty grid is never the right thing to show a visitor.
  const services =
    !isPending && !isError && result && result.items.length > 0
      ? result.items.map(mapApiServiceToService)
      : SERVICES;

  return (
    <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
