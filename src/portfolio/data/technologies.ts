import { Html5Icon, Css3Icon, JavaScriptIcon } from "../assets/icons";

import type { TechnologyCategoryData, SectionHeaderConfig } from "../types";

export const TECHNOLOGIES_HEADER: SectionHeaderConfig = {
  badge: "Technologies",
  title: "Tools &\nTechnologies",
  subtitle:
    "A comprehensive toolkit for building modern, scalable web applications.",
} as const;

export const TECHNOLOGY_CATEGORIES: readonly TechnologyCategoryData[] = [
  {
    category: "Languages",
    items: [
      // { name: "React", icon: Globe },
      // { name: "Next.js", icon: Globe },
      // { name: "TanStack", icon: Layers },
      { name: "HTML5", icon: Html5Icon },
      { name: "CSS3", icon: Css3Icon },
      { name: "JavaScript", icon: JavaScriptIcon },
      // { name: "TypeScript", icon: Blocks },
      // { name: "C#", icon: Blocks },
      // { name: "Java", icon: Blocks },
      // { name: "Python", icon: Blocks },

      // { name: "SCSS", icon: Wind },
      // { name: "Tailwind CSS", icon: Wind },
      // { name: "Bootstrap", icon: SquareCode },
      // { name: "Material UI", icon: Component },
      // { name: "Shadcn UI", icon: Sparkles },
      // { name: "Motion", icon: Frame },
      // { name: "GSAP", icon: Sparkles },
      // { name: "Expo", icon: Smartphone },
    ],
  },
  {
    category: "Frontend Development",
    items: [
      // { name: "JavaScript", icon: FileCode2 },
      // { name: "TypeScript", icon: Blocks },
      // { name: "React", icon: Atom },
      // { name: "Next.js", icon: Globe },
      // { name: "TanStack", icon: Layers },
      // { name: "HTML5", icon: FileJson2 },
      // { name: "CSS3", icon: Hash },
      // { name: "SCSS", icon: Wind },
      // { name: "Tailwind CSS", icon: Wind },
      // { name: "Bootstrap", icon: SquareCode },
      // { name: "Material UI", icon: Component },
      // { name: "Shadcn UI", icon: Sparkles },
      // { name: "Motion", icon: Frame },
      // { name: "GSAP", icon: Sparkles },
      // { name: "Expo", icon: Smartphone },
    ],
  },
  {
    category: "Backend Development",
    items: [
      // { name: "Node.js", icon: Server },
      // { name: "Express", icon: Truck },
      // { name: "MongoDB", icon: Database },
      // { name: "PostgreSQL", icon: Database },
      // { name: "Firebase", icon: Flame },
      // { name: "Drizzle", icon: GitBranch },
      // { name: "Docker", icon: Container },
      // { name: "AWS", icon: Cloud },
      // { name: "Hono", icon: Zap },
    ],
  },
  {
    category: "Design",
    items: [
      // { name: "Figma", icon: Proportions },
      // { name: "Adobe Photoshop", icon: Pen },
      // { name: "Adobe Illustrator", icon: PenTool },
      // { name: "Adobe XD", icon: Brush },
      // { name: "Canva", icon: Image },
      // { name: "Webflow", icon: Layout },
      // { name: "WordPress", icon: Workflow },
      // { name: "Wix", icon: MousePointer2 },
      // { name: "Elementor", icon: Component },
    ],
  },
  {
    category: "AI & Automation",
    items: [
      // { name: "ChatGPT", icon: Bot },
      // { name: "Claude", icon: BrainCircuit },
      // { name: "Zapier", icon: Link },
      // { name: "Puppeteer", icon: FlaskConical },
      // { name: "Playwright", icon: Theater },
    ],
  },
] as const;
