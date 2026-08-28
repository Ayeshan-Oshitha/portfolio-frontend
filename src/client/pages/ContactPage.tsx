import Contact from "@/client/components/contact/Contact";
import { CONTACT_STEPS } from "@/client/data/contact";

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-195 w-287 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-30 -left-80 h-190 w-190 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-22 px-4 pt-22 pb-26 sm:px-6 lg:px-8">
        <Contact />

        <div>
          <h2 className="mb-7 font-display text-[28px] font-medium tracking-[-0.018em] text-text-primary md:text-[36px]">
            What happens next
          </h2>

          <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
            {CONTACT_STEPS.map((step) => (
              <div
                key={step.id}
                className="flex flex-col gap-3 rounded-[20px] border border-card-br bg-card p-8 shadow-card"
              >
                <span className="font-display text-[30px] leading-none font-medium tabular-nums text-primary-400">
                  {step.step}
                </span>
                <h3 className="font-display text-[20px] font-medium tracking-[-0.018em] text-text-primary">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-text-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
