import { ABOUT_DATA } from "@/portfolio/data/about";
import AboutContent from "./AboutContent";
import AboutImage from "./AboutImage";

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Content */}
          <AboutContent data={ABOUT_DATA} />

          {/* Right — Image */}
          <AboutImage
            src={ABOUT_DATA.imagePlaceholder}
            alt={`Portrait of ${ABOUT_DATA.name.replace("!", "")}`}
          />
        </div>
      </div>
    </section>
  );
}
