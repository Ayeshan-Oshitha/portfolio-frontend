import { TRUSTED_BY } from "@/client/data/hero";

export default function TrustedBy() {
  return (
    <section className="mt-20 border-y border-hair py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-[0.14em] text-text-muted">
          TRUSTED BY TEAMS BUILDING SERIOUS SOFTWARE
        </p>

        <div className="mt-6.5 flex flex-wrap items-center justify-center gap-x-17 gap-y-5 opacity-50">
          {TRUSTED_BY.map((client) => (
            <span
              key={client}
              className="font-display text-[21px] font-medium text-text-primary"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
