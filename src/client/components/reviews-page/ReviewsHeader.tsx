import { Star } from "lucide-react";
import Eyebrow from "@/client/components/ui/Eyebrow";

interface ReviewsHeaderProps {
  /** Averaged from the loaded reviews — null while none have arrived. */
  readonly average: number | null;
  readonly count: number;
}

export default function ReviewsHeader({ average, count }: ReviewsHeaderProps) {
  const rounded = average === null ? 0 : Math.round(average);

  return (
    <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
      <div className="max-w-2xl">
        <Eyebrow className="mb-5">Client reviews</Eyebrow>
        <h1 className="font-display text-[40px] leading-[1.05] font-medium tracking-[-0.018em] text-text-primary sm:text-[52px] lg:text-[66px]">
          What it&rsquo;s like
          <br />
          to work with us.
        </h1>
        <p className="mt-5.5 max-w-xl text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
          Unedited feedback from the people who signed the invoices. The
          critical ones stay up too.
        </p>
      </div>

      {count > 0 && (
        <div className="w-full shrink-0 rounded-[20px] border border-card-br bg-card p-8 shadow-card lg:w-70">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[52px] leading-none font-medium tabular-nums text-text-primary">
              {average?.toFixed(1)}
            </span>
            <span className="text-base text-text-muted">/ 5</span>
          </div>

          <div
            className="mt-3 flex gap-1 text-star"
            aria-label={`Average rating ${average?.toFixed(1)} out of 5`}
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={18}
                aria-hidden="true"
                className={
                  index < rounded ? "fill-current" : "text-border-default"
                }
              />
            ))}
          </div>

          <p className="mt-3 text-[13.5px] tabular-nums text-text-muted">
            Based on {count} verified client {count === 1 ? "review" : "reviews"}
          </p>
        </div>
      )}
    </div>
  );
}
