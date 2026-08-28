import AboutHero from "@/client/components/about-page/AboutHero";
import MyStory from "@/client/components/about-page/MyStory";
import CoreValues from "@/client/components/about-page/CoreValues";
import Team from "@/client/components/about-page/Team";
import Technologies from "@/client/components/technologies/Technologies";
import Metrics from "@/client/components/metrics/Metrics";
import PanelCTA from "@/client/components/ui/PanelCTA";
import { ABOUT_METRICS } from "@/client/data/about-page";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-70 left-1/2 h-200 w-312 -translate-x-1/2 fw-amb-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-95 -left-80 h-200 w-200 fw-amb-2"
      />

      <div className="relative z-2 mx-auto flex max-w-7xl flex-col gap-25 px-4 pt-24 pb-26 sm:px-6 lg:px-8">
        <AboutHero />
        <MyStory />
        <CoreValues />
        <Technologies />
        <Team />
      </div>

      <Metrics metrics={ABOUT_METRICS} className="relative z-2" />

      <div className="relative z-2 mx-auto max-w-7xl px-4 py-22 sm:px-6 lg:px-8">
        <PanelCTA
          align="center"
          title={
            <>
              Let&rsquo;s build something
              <br />
              that lasts a decade.
            </>
          }
          description="Tell us what you're building. You'll get a scoped proposal and a fixed price within three working days."
          primaryLabel="Start a project"
          primaryHref="/contact"
          secondaryLabel="See our work"
          secondaryHref="/work"
        />
      </div>
    </div>
  );
}
