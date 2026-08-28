import type { AboutHeroData } from "@/client/types";

export const ABOUT_HERO: AboutHeroData = {
  badge: "About us",
  title: "A small studio that ships\nlike a much bigger one.",
  description:
    "FrostWoodTech builds and runs its own SaaS products, and takes on a handful of client platforms a year. The two feed each other — everything we learn shipping our own software goes straight into what we build for you.",
} as const;
