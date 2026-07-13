import { Lightbulb, Target, Users, Zap } from "lucide-react";
import type { Experience, StoryData, Highlight, CoreValue, SectionHeaderConfig } from "@/portfolio/types";

export const EXPERIENCES_HEADER: SectionHeaderConfig = {
  badge: "Experience",
  title: "Professional Journey",
  subtitle: "A timeline of my roles in design and development.",
};

export const EXPERIENCES_DATA: readonly Experience[] = [
  {
    id: "exp-1",
    role: "Senior Frontend Engineer",
    company: "Tech Innovators Inc.",
    period: "2022 - Present",
    description: "Lead the frontend architecture for scalable web applications using React, Next.js, and Tailwind CSS. Mentored junior developers and established CI/CD best practices.",
  },
  {
    id: "exp-2",
    role: "Frontend Developer",
    company: "Creative Web Studio",
    period: "2019 - 2022",
    description: "Developed performant and accessible user interfaces for e-commerce clients. Bridged the gap between design and engineering teams.",
  },
  {
    id: "exp-3",
    role: "UI/UX Designer",
    company: "Digital Design Agency",
    period: "2017 - 2019",
    description: "Created wireframes, prototypes, and high-fidelity mockups. Conducted user research and usability testing to drive design decisions.",
  },
] as const;

export const STORY_DATA: StoryData = {
  badge: "My Story",
  title: "From Design to Development",
  paragraphs: [
    "I didn't start out writing code. My journey began in graphic design, where I learned the fundamentals of composition, color theory, and typography. I spent years crafting visual identities and user experiences in Figma and Adobe Suite.",
    "But I always wanted to bring my designs to life. I was frustrated by the disconnect between how something looked in a mockup and how it functioned in the browser. That drive led me to learn HTML, CSS, and eventually JavaScript.",
    "Today, I operate at the intersection of design and engineering. Because of my background, I don't just see components as blocks of code—I see them as interactive pieces of a larger brand story. I specialize in building fast, scalable React applications with a relentless focus on the end-user experience."
  ],
};

export const HIGHLIGHTS_HEADER: SectionHeaderConfig = {
  badge: "Impact",
  title: "Career Highlights",
};

export const HIGHLIGHTS_DATA: readonly Highlight[] = [
  { id: "hl-1", metric: "5+", label: "Years of Experience" },
  { id: "hl-2", metric: "30+", label: "Projects Completed" },
  { id: "hl-3", metric: "100%", label: "Client Satisfaction" },
  { id: "hl-4", metric: "1M+", label: "Lines of Code" },
] as const;

export const VALUES_HEADER: SectionHeaderConfig = {
  badge: "Principles",
  title: "Core Values",
};

export const VALUES_DATA: readonly CoreValue[] = [
  {
    id: "val-1",
    title: "User-Centric Design",
    description: "Every decision is made with the end-user in mind. If it doesn't solve a real problem, it's just decoration.",
    icon: Users,
  },
  {
    id: "val-2",
    title: "Performance First",
    description: "Speed is a feature. I build lightweight, optimized applications that respect the user's time and bandwidth.",
    icon: Zap,
  },
  {
    id: "val-3",
    title: "Continuous Learning",
    description: "Technology evolves rapidly. I stay curious and adaptable, always exploring new tools and methodologies.",
    icon: Lightbulb,
  },
  {
    id: "val-4",
    title: "Pixel Perfection",
    description: "The details matter. I ensure that the final product matches the design intent with absolute precision.",
    icon: Target,
  },
] as const;
