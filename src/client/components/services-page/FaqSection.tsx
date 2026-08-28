import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Eyebrow from "@/client/components/ui/Eyebrow";
import { FAQ_DATA } from "@/client/data/services-page";
import type { FAQ } from "@/client/types";

interface FaqSectionProps {
  readonly faqs?: readonly FAQ[];
}

export default function FaqSection({ faqs = FAQ_DATA }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-15">
      <div>
        <Eyebrow className="mb-4.5">Questions</Eyebrow>
        <h2 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.018em] text-text-primary md:text-[40px]">
          Before you ask
        </h2>
        <p className="mt-4 text-[15.5px] leading-[1.65] text-text-secondary">
          Something not covered? Ask on the call — we would rather answer it
          than have you guess.
        </p>
      </div>

      <div className="flex flex-col gap-3.5 lg:col-span-2">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="rounded-2xl border border-card-br bg-card shadow-card"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-5 px-7 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-inset"
              >
                <span className="text-[17px] font-bold text-text-primary">
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 text-text-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-7 pb-6 text-[15.5px] leading-[1.7] text-text-secondary">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
