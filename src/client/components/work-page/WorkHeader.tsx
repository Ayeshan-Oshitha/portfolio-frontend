import Eyebrow from "@/client/components/ui/Eyebrow";

export default function WorkHeader() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
      <div className="max-w-2xl">
        <Eyebrow className="mb-5">Selected work</Eyebrow>
        <h1 className="font-display text-[40px] leading-[1.05] font-medium tracking-[-0.018em] text-text-primary sm:text-[52px] lg:text-[66px]">
          Things we&rsquo;ve built,
          <br />
          and what they changed.
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
          Products and platforms shipped for founders, operators and teams who
          needed the details right the first time.
        </p>
      </div>

      <div className="shrink-0 lg:text-right">
        <div className="font-display text-[48px] leading-none font-medium tabular-nums text-text-primary sm:text-[56px]">
          40<span className="text-primary-400">+</span>
        </div>
        <div className="mt-2 text-[13.5px] text-text-muted">
          projects delivered since 2019
        </div>
      </div>
    </div>
  );
}
