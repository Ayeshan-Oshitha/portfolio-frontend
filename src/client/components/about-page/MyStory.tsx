import Button from "@/client/components/ui/Button";
import Eyebrow from "@/client/components/ui/Eyebrow";
import { STORY_DATA } from "@/client/data/about-page";

export default function MyStory() {
  return (
    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
      {/* The frost mark, drawn large. */}
      <div className="relative h-110 overflow-hidden rounded-[22px] fw-media border border-hair shadow-card">
        <svg
          viewBox="0 0 620 440"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-media-fg"
          aria-hidden="true"
        >
          <g opacity="0.45" stroke="currentColor" fill="none" strokeWidth="1.3">
            <path d="M310 40v360M150 110l320 220M470 110L150 330" />
            <path d="M310 130l56 32M310 130l-56 32M310 310l56-32M310 310l-56-32" />
            <circle cx="310" cy="220" r="150" />
            <circle cx="310" cy="220" r="96" />
            <circle cx="310" cy="220" r="46" />
          </g>
          <circle cx="310" cy="220" r="16" fill="currentColor" opacity="0.7" />
        </svg>
      </div>

      <div>
        <Eyebrow tone="ice" className="mb-4.5">
          {STORY_DATA.badge}
        </Eyebrow>
        <h2 className="font-display text-[32px] leading-[1.12] font-medium tracking-[-0.018em] text-text-primary md:text-[42px]">
          {STORY_DATA.title}
        </h2>

        {STORY_DATA.paragraphs.map((paragraph, index) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`text-[16.5px] leading-[1.75] text-text-secondary ${
              index === 0 ? "mt-5" : "mt-4"
            }`}
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-7.5 flex flex-wrap gap-3.5">
          <Button href="/work">See our work</Button>
          <Button href="/blog" variant="secondary">
            Read the blog
          </Button>
        </div>
      </div>
    </div>
  );
}
