import { Mail } from "lucide-react";
import type { ContactData } from "@/client/types";

interface ContactInfoProps {
  readonly data: ContactData;
}

export default function ContactInfo({ data }: ContactInfoProps) {
  return (
    <div className="flex flex-col justify-center">
      {/* Badge */}
      <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase rounded-full bg-primary-600/10 text-primary-400 border border-primary-600/20 w-fit">
        <span className="text-primary-400">//</span>
        {data.badge}
      </span>

      {/* Headline */}
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-6 whitespace-pre-line">
        <span className="text-text-primary">{data.headlinePrimary}</span>
        <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
          {data.headlineHighlight}
        </span>
        <span className="text-text-primary">{data.headlineSuffix}</span>
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-10 max-w-md">
        {data.description}
      </p>

      {/* Email card */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-900/60 border border-border-subtle max-w-sm">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-600/20 shrink-0">
          <Mail size={20} className="text-primary-400" />
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-0.5">
            Email
          </p>
          <a
            href={`mailto:${data.email}`}
            className="text-sm font-medium text-text-primary hover:text-primary-400 transition-colors duration-200"
          >
            {data.email}
          </a>
        </div>
      </div>
    </div>
  );
}
