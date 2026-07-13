import { ArrowRight } from "lucide-react";
import Button from "@/portfolio/components/ui/Button";

export default function CtaBanner() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950/40 via-surface-950 to-accent-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary-600/10 blur-[100px] rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary mb-6">
          Let's build something{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
            together.
          </span>
        </h2>
        <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
          Whether you need a new website, a complex web application, or just
          some advice on your next move—I'm here to help.
        </p>
        <Button
          href="/contact"
          size="lg"
          icon={<ArrowRight size={18} />}
          className="uppercase tracking-wider font-bold shadow-xl shadow-primary-600/20"
        >
          Start a Conversation
        </Button>
      </div>
    </section>
  );
}
