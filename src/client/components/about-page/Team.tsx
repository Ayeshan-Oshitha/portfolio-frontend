import { Plus } from "lucide-react";
import Eyebrow from "@/client/components/ui/Eyebrow";
import { TEAM_DATA, TEAM_HEADER } from "@/client/data/about-page";

export default function Team() {
  return (
    <div>
      <div className="mb-10 max-w-2xl">
        {TEAM_HEADER.badge && (
          <Eyebrow className="mb-4.5">{TEAM_HEADER.badge}</Eyebrow>
        )}
        <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[44px]">
          {TEAM_HEADER.title}
        </h2>
        {TEAM_HEADER.subtitle && (
          <p className="mt-3.5 text-[15.5px] leading-[1.65] text-text-secondary">
            {TEAM_HEADER.subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM_DATA.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center rounded-[20px] border border-card-br bg-card p-7 text-center shadow-card"
          >
            {member.isOpenRole ? (
              <span
                aria-hidden="true"
                className="flex h-19.5 w-19.5 items-center justify-center rounded-full border border-dashed border-hair-strong text-text-muted"
              >
                <Plus size={26} />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="flex h-19.5 w-19.5 items-center justify-center rounded-full fw-btn text-2xl font-bold"
              >
                {member.initials}
              </span>
            )}

            <h3 className="mt-4 font-display text-[19px] font-medium tracking-[-0.018em] text-text-primary">
              {member.name}
            </h3>
            <p className="mt-1.5 text-[13.5px] text-text-muted">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
