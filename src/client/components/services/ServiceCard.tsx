import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import IconTile from "@/client/components/ui/IconTile";
import type { Service } from "@/client/types";

interface ServiceCardProps {
  readonly service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      to={service.href}
      className="group flex min-h-73 flex-col gap-4 rounded-[20px] border border-card-br bg-card p-8 shadow-card transition-colors duration-200 hover:border-hair-strong"
    >
      <IconTile>
        {service.iconUrl ? (
          <img
            src={service.iconUrl}
            alt={service.iconAltText ?? ""}
            className="h-5 w-5 object-contain"
          />
        ) : Icon ? (
          <Icon size={20} aria-hidden="true" />
        ) : null}
      </IconTile>

      <h3 className="font-display text-[21px] font-medium tracking-[-0.018em] text-text-primary">
        {service.title}
      </h3>

      <p className="text-[14.5px] leading-[1.65] text-text-secondary">
        {service.description}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13.5px] font-bold text-accent-400">
        Learn more
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
