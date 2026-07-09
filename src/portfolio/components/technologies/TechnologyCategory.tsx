import type { TechnologyCategoryData } from "../../types";
import TechnologyBadge from "./TechnologyBadge";

interface TechnologyCategoryProps {
  readonly category: TechnologyCategoryData;
}

export default function TechnologyCategory({
  category,
}: TechnologyCategoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary tracking-tight">
        {category.category}
      </h3>
      <div className="flex flex-wrap gap-1">
        {category.items.map((tech) => (
          <TechnologyBadge key={tech.name} technology={tech} />
        ))}
      </div>
    </div>
  );
}
