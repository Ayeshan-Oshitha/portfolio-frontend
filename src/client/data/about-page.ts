import type {
  CoreValue,
  Metric,
  SectionHeaderConfig,
  StoryData,
  TeamMember,
} from "@/client/types";
import { Handshake, MessageSquareWarning, Scissors } from "lucide-react";

export const STORY_DATA: StoryData = {
  badge: "Our story",
  title: "Named for the two things good software needs.",
  paragraphs: [
    "Frost, for the clarity — a system you can see through, where the structure is obvious and nothing is hidden. Wood, for the growth — something that keeps standing, keeps adding rings, and does not need replacing every three years.",
    "We started in 2019 doing client work, got tired of watching good products die from bad foundations, and started building our own. Today we run a small suite of SaaS products and take on a deliberately limited number of client platforms — enough to stay sharp, few enough to stay obsessive.",
  ],
} as const;

export const VALUES_HEADER: SectionHeaderConfig = {
  badge: "How we think",
  title: "Three rules we do not bend.",
} as const;

export const VALUES_DATA: readonly CoreValue[] = [
  {
    id: "ownership",
    title: "You own everything",
    description:
      "Code, accounts, infrastructure, domain — in your name from the first commit. We never hold a product hostage to keep a retainer alive.",
    icon: Handshake,
  },
  {
    id: "bad-news",
    title: "Bad news travels fast",
    description:
      "If something slips, you hear it the day we know — not at the deadline. A schedule you can trust is worth more than one that sounds good.",
    icon: MessageSquareWarning,
  },
  {
    id: "less-scope",
    title: "Fewer features, done properly",
    description:
      "We will talk you out of scope. Every feature is a permanent maintenance cost, and the ones nobody uses are the expensive kind.",
    icon: Scissors,
  },
] as const;

export const TEAM_HEADER: SectionHeaderConfig = {
  badge: "The team",
  title: "The people who do the work.",
  subtitle:
    "No account managers, no layers. The person you meet on the call is the person who writes the code.",
} as const;

export const TEAM_DATA: readonly TeamMember[] = [
  {
    id: "oshitha",
    name: "Oshitha Costa",
    role: "Founder & engineer",
    initials: "OC",
  },
  {
    id: "member-2",
    name: "[TEAM MEMBER]",
    role: "[ROLE]",
    initials: "[ ]",
  },
  {
    id: "member-3",
    name: "[TEAM MEMBER]",
    role: "[ROLE]",
    initials: "[ ]",
  },
  {
    id: "hiring",
    name: "We're hiring",
    role: "Senior engineers, remote",
    initials: "+",
    isOpenRole: true,
  },
] as const;

export const ABOUT_METRICS: readonly Metric[] = [
  { id: "founded", value: "2019", label: "Year we started" },
  {
    id: "shipped",
    value: "40",
    suffix: "+",
    suffixTone: "forest",
    label: "Products & platforms shipped",
  },
  {
    id: "retention",
    value: "98",
    suffix: "%",
    suffixTone: "forest",
    label: "Clients who come back",
  },
  {
    id: "release",
    value: "6",
    suffix: "wk",
    suffixTone: "ice",
    label: "Median time to first release",
  },
] as const;
