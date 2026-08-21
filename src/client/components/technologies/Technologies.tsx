import {
  TECHNOLOGIES_HEADER,
  TECHNOLOGY_CATEGORIES,
} from "@/client/data/technologies";
import SectionHeader from "../ui/SectionHeader";
import TechnologyCategory from "./TechnologyCategory";

export default function Technologies() {
  return (
    <section
      id="technologies"
      className="relative py-24 sm:py-32"
      aria-labelledby="technologies-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader {...TECHNOLOGIES_HEADER} />

        <div className="space-y-10">
          {TECHNOLOGY_CATEGORIES.map((category) => (
            <TechnologyCategory key={category.category} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
