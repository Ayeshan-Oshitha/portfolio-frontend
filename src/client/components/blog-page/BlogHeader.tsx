import Eyebrow from "@/client/components/ui/Eyebrow";

export default function BlogHeader() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow align="center" className="mb-5">
        Field notes
      </Eyebrow>
      <h1 className="font-display text-[40px] leading-[1.06] font-medium tracking-[-0.018em] text-text-primary sm:text-[54px] lg:text-[66px]">
        What we learn,
        <br />
        written down.
      </h1>
      <p className="mt-5.5 text-[17px] leading-[1.62] text-text-secondary sm:text-[18.5px]">
        Engineering decisions, design arguments and the occasional post-mortem —
        from projects we actually shipped.
      </p>
    </div>
  );
}
