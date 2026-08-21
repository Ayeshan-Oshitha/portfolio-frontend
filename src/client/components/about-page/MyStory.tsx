import { STORY_DATA } from "@/client/data/about-page";
import Badge from "@/client/components/ui/Badge";

export default function MyStory() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col items-center sm:items-start mb-12">
          <Badge variant="subtle" className="mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 inline-block" />
            {STORY_DATA.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary">
            {STORY_DATA.title}
          </h2>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-text-secondary">
          {STORY_DATA.paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
