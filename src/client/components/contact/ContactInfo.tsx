import { Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Eyebrow from "@/client/components/ui/Eyebrow";
import IconTile from "@/client/components/ui/IconTile";
import { SOCIAL_LINKS } from "@/client/data/navigation";
import type { ContactData } from "@/client/types";

interface ContactInfoProps {
  readonly data: ContactData;
}

function Method({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <IconTile>
        <Icon size={19} aria-hidden="true" />
      </IconTile>
      <div className="min-w-0">
        <div className="text-xs font-bold tracking-[0.09em] text-text-muted">
          {label}
        </div>
        <div className="mt-1 truncate text-base font-semibold text-text-primary">
          {value}
        </div>
      </div>
    </>
  );

  const classes =
    "flex items-center gap-4 rounded-2xl border border-card-br bg-card p-5 shadow-card";

  return href ? (
    <a
      href={href}
      className={`${classes} transition-colors hover:border-hair-strong`}
    >
      {body}
    </a>
  ) : (
    <div className={classes}>{body}</div>
  );
}

export default function ContactInfo({ data }: ContactInfoProps) {
  return (
    <div>
      <Eyebrow className="mb-5">{data.badge}</Eyebrow>

      <h1
        id="contact-heading"
        className="font-display text-[38px] leading-[1.05] font-medium tracking-[-0.018em] whitespace-pre-line text-text-primary sm:text-[50px] lg:text-[62px]"
      >
        {data.title}
      </h1>

      <p className="mt-5.5 max-w-lg text-[17px] leading-[1.65] text-text-secondary sm:text-[18.5px]">
        {data.description}
      </p>

      <div className="mt-10 flex flex-col gap-3.5">
        <Method
          icon={Mail}
          label="EMAIL"
          value={data.email}
          href={`mailto:${data.email}`}
        />
        <Method icon={Phone} label="PHONE" value={data.phone} />
        <Method icon={MapPin} label="STUDIO" value={data.location} />
      </div>

      <div className="mt-7 flex items-center gap-3 rounded-2xl border border-raise-br bg-raise px-5 py-4">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary-400"
        />
        <span className="text-[14.5px] text-text-secondary">
          {data.availability}
        </span>
      </div>

      <div className="mt-6 flex gap-2.5">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.platform}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.ariaLabel}
              className="flex h-10.5 w-10.5 items-center justify-center rounded-xl border border-card-br bg-card text-text-secondary transition-colors duration-200 hover:text-text-primary"
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
