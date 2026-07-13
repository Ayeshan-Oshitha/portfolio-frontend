import type { BlogPost } from "@/portfolio/types";

export const BLOG_CATEGORIES = [
  "Guides",
  "Engineering",
  "Design",
  "Career",
  "Updates",
] as const;

export const ALL_POSTS: readonly BlogPost[] = [
  {
    id: "post-1",
    title: "7 Signs Your Business Website Needs a Redesign",
    excerpt: "Not sure if it's time for a new website? Here are seven clear signs your business site needs a redesign — and what a modern, high-converting site should do instead.",
    category: "Guides",
    date: "June 7, 2026",
    readTime: "2 min read",
    imagePlaceholder: "/images/blog/redesign.webp",
    href: "#",
  },
  {
    id: "post-2",
    title: "How to Build Scalable React Applications",
    excerpt: "A deep dive into architecture patterns, state management, and performance optimization techniques for enterprise-grade React codebases.",
    category: "Engineering",
    date: "May 22, 2026",
    readTime: "8 min read",
    imagePlaceholder: "/images/blog/react-arch.webp",
    href: "#",
  },
  {
    id: "post-3",
    title: "The Psychology of Color in UI Design",
    excerpt: "Understanding how different hues impact user behavior, emotions, and conversion rates on modern web platforms.",
    category: "Design",
    date: "April 14, 2026",
    readTime: "5 min read",
    imagePlaceholder: "/images/blog/color-theory.webp",
    href: "#",
  },
  {
    id: "post-4",
    title: "Navigating the Freelance Developer Market",
    excerpt: "Lessons learned from 5 years of freelancing: how to find clients, price your services, and manage your time effectively.",
    category: "Career",
    date: "March 30, 2026",
    readTime: "6 min read",
    imagePlaceholder: "/images/blog/freelance.webp",
    href: "#",
  },
] as const;
