import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_DATA } from "@/portfolio/data/services-page";

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ_DATA.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all duration-300 ${
                isOpen
                  ? "bg-[#111] border-primary-500/30"
                  : "bg-[#0a0a0a] border-border-subtle hover:border-text-muted"
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-base sm:text-lg font-bold text-text-primary pr-8">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "text-primary-400 rotate-180" : "text-primary-600"}`}
                >
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
