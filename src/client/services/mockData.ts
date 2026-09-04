// Dummy data for previewing the site without the backend running.
// Enable by setting VITE_USE_MOCK_DATA=true in a local .env.local (gitignored).
import type { ApiArticle, ApiProject, ApiReview } from "@/client/types";

function tag(
  name: string,
  isTechnology: boolean,
  sortOrder: number,
): ApiProject["tags"][number] {
  return {
    id: `tag-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    isTechnology,
    sortOrder,
  };
}

function image(
  id: string,
  seed: string,
  isPrimary: boolean,
  sortOrder: number,
): ApiProject["images"][number] {
  return {
    id,
    objectKey: `mock/${seed}.jpg`,
    url: `https://placehold.co/1200x800/1a1a1a/ffffff?text=${encodeURIComponent(seed)}`,
    altText: seed,
    width: 1200,
    height: 800,
    isPrimary,
    sortOrder,
  };
}

export const MOCK_PROJECTS: readonly ApiProject[] = [
  {
    id: "mock-project-1",
    slug: "dropfi",
    title: "DropFi",
    year: 2025,
    shortDescription: "Finally, a Modern XRP Wallet That Doesn't Suck",
    description:
      "A zero-permission architecture XRP wallet offering pure, decentralized access to the XRP Ledger on-chain, on your terms.",
    websiteUrl: "https://example.com/dropfi",
    problem:
      "Existing XRP wallets required users to trust custodial intermediaries, exposing them to unnecessary risk.",
    solution:
      "We built a fully non-custodial wallet with a zero-permission architecture, giving users direct on-chain control.",
    whatWeDelivered:
      "A cross-platform wallet app, a public REST API for balance/transaction queries, and a marketing site.",
    proof: "Onboarded 12,000+ wallets in the first quarter after launch.",
    clientName: "DropFi Labs",
    featured: true,
    sortOrder: 1,
    tags: [
      tag("Frontend Development", false, 1),
      tag("Backend Development", false, 2),
      tag("Next.js", true, 1),
      tag("React", true, 2),
      tag("TypeScript", true, 3),
    ],
    images: [image("img-dropfi-1", "DropFi", true, 1)],
  },
  {
    id: "mock-project-2",
    slug: "cryptoland",
    title: "CryptoLand",
    year: 2024,
    shortDescription: "Blockchain based Strategy Game",
    description:
      "An immersive blockchain strategy game where players build, trade, and conquer using smart contracts and NFTs.",
    websiteUrl: "https://example.com/cryptoland",
    problem:
      "Blockchain games at the time felt shallow and purely speculative.",
    solution:
      "We designed real strategic depth around resource management, with smart contracts handling trades transparently.",
    whatWeDelivered:
      "A browser-based game client, a Solidity contract suite, and an NFT marketplace integration.",
    proof:
      "Featured on three blockchain gaming leaderboards within a month of launch.",
    clientName: "CryptoLand Studios",
    featured: true,
    sortOrder: 2,
    tags: [
      tag("Frontend Development", false, 1),
      tag("Web Design", false, 2),
      tag("Blockchain Development", false, 3),
      tag("React", true, 1),
      tag("Solidity", true, 2),
    ],
    images: [image("img-cryptoland-1", "CryptoLand", true, 1)],
  },
  {
    id: "mock-project-3",
    slug: "sf-ventures",
    title: "S.F. Ventures",
    year: 2023,
    shortDescription: "Take your business to new heights",
    description:
      "Modern business solutions portal designed to help companies track growth metrics and manage clients.",
    websiteUrl: "https://example.com/sf-ventures",
    problem:
      "The client was managing growth metrics across disconnected spreadsheets.",
    solution:
      "We built a unified portal with live dashboards and a CMS so their team could self-serve content updates.",
    whatWeDelivered:
      "A Vue.js dashboard, a headless CMS setup, and a PostgreSQL-backed reporting API.",
    proof: "Cut monthly reporting time from two days to under an hour.",
    clientName: "S.F. Ventures Inc.",
    featured: true,
    sortOrder: 3,
    tags: [
      tag("Web Design", false, 1),
      tag("Content Management (CMS)", false, 2),
      tag("Integrations & Automation", false, 3),
      tag("Vue.js", true, 1),
      tag("PostgreSQL", true, 2),
    ],
    images: [image("img-sfventures-1", "SF Ventures", true, 1)],
  },
  {
    id: "mock-project-4",
    slug: "flavour-fusion",
    title: "Flavour Fusion",
    year: 2022,
    shortDescription: "A culinary experience like no other",
    description:
      "A premium restaurant website with online reservations, menu management, and a seamless ordering experience.",
    websiteUrl: "https://example.com/flavour-fusion",
    problem:
      "Phone-only reservations were costing the restaurant walk-in revenue during peak hours.",
    solution:
      "We shipped an online reservation and ordering flow tied directly into their POS.",
    whatWeDelivered:
      "A React storefront, Stripe-powered checkout, and a Firebase-backed reservation system.",
    proof: "Online orders now account for 30% of weekly revenue.",
    clientName: "Flavour Fusion Restaurant Group",
    featured: false,
    sortOrder: 4,
    tags: [
      tag("Web Design", false, 1),
      tag("Frontend Development", false, 2),
      tag("React", true, 1),
      tag("Stripe API", true, 2),
    ],
    images: [image("img-flavourfusion-1", "Flavour Fusion", true, 1)],
  },
  {
    id: "mock-project-5",
    slug: "apex-fitness",
    title: "Apex Fitness",
    year: 2021,
    shortDescription: "Transform your body, transform your life",
    description:
      "A modern fitness app with membership management, class scheduling, and health progress tracking.",
    websiteUrl: "https://example.com/apex-fitness",
    problem:
      "Members had no easy way to book classes or track progress between visits.",
    solution:
      "We built a mobile app with class booking, progress charts, and push reminders.",
    whatWeDelivered:
      "A React Native app, a GraphQL API, and an AWS-hosted backend.",
    proof: "Class no-show rates dropped by 40% after launch.",
    clientName: "Apex Fitness Clubs",
    featured: false,
    sortOrder: 5,
    tags: [
      tag("Mobile Development", false, 1),
      tag("Backend Development", false, 2),
      tag("React Native", true, 1),
      tag("GraphQL", true, 2),
    ],
    images: [image("img-apexfitness-1", "Apex Fitness", true, 1)],
  },
];

export const MOCK_ARTICLES: readonly ApiArticle[] = [
  {
    id: "mock-article-1",
    title: "7 Signs Your Business Website Needs a Redesign",
    excerpt:
      "Not sure if it's time for a new website? Here are seven clear signs your business site needs a redesign — and what a modern, high-converting site should do instead.",
    slug: "signs-your-website-needs-a-redesign",
    publishedDate: "2026-06-07T00:00:00Z",
    contentMarkdown:
      "## Is it time?\n\nIf your site still looks like it was built for a smaller screen and a slower internet, it's costing you conversions.\n\n1. It isn't mobile-friendly\n2. Load times exceed three seconds\n3. Your bounce rate is climbing\n4. The design doesn't reflect your brand anymore\n5. It's hard to update content yourself\n6. There's no clear call to action\n7. Competitors' sites feel more modern\n\nA redesign done right pays for itself in the first quarter.",
    featured: true,
    sortOrder: 1,
    tags: [tag("Guides", false, 1)],
  },
  {
    id: "mock-article-2",
    title: "How to Build Scalable React Applications",
    excerpt:
      "A deep dive into architecture patterns, state management, and performance optimization techniques for enterprise-grade React codebases.",
    slug: "scalable-react-applications",
    publishedDate: "2026-05-22T00:00:00Z",
    contentMarkdown:
      "## Architecture first\n\nScalability starts with a clear content/presentation split and predictable data flow.\n\n- Keep state close to where it's used\n- Prefer composition over inheritance\n- Cache aggressively, invalidate deliberately\n- Measure before optimizing\n\nThese patterns keep large codebases maintainable as teams grow.",
    featured: true,
    sortOrder: 2,
    tags: [tag("Engineering", false, 1)],
  },
  {
    id: "mock-article-3",
    title: "The Psychology of Color in UI Design",
    excerpt:
      "Understanding how different hues impact user behavior, emotions, and conversion rates on modern web platforms.",
    slug: "psychology-of-color-in-ui-design",
    publishedDate: "2026-04-14T00:00:00Z",
    contentMarkdown:
      "## Color shapes behavior\n\nWarm colors draw attention and urgency; cool colors build trust and calm.\n\nWhen designing a call-to-action, contrast matters more than the specific hue — but once contrast is solved, color choice can still nudge conversion rates by a meaningful margin.",
    featured: false,
    sortOrder: 3,
    tags: [tag("Design", false, 1)],
  },
];

export const MOCK_REVIEWS: readonly ApiReview[] = [
  {
    id: "mock-review-1",
    name: "Amara Okafor",
    country: "Nigeria",
    countryCode: "NG",
    position: "Founder, DropFi Labs",
    rating: 5,
    reviewText:
      "Delivered exactly what we needed, on time and with great communication throughout. Would work together again in a heartbeat.",
    createdAt: "2026-06-01T00:00:00Z",
    isFeatured: true,
  },
  {
    id: "mock-review-2",
    name: "Liam Sørensen",
    country: "Denmark",
    countryCode: "DK",
    position: "CTO, CryptoLand Studios",
    rating: 5,
    reviewText:
      "Technical depth and product sense in equal measure. Our game shipped faster than we thought possible.",
    createdAt: "2026-05-18T00:00:00Z",
    isFeatured: true,
  },
  {
    id: "mock-review-3",
    name: "Priya Raman",
    country: "India",
    countryCode: "IN",
    position: "Operations Lead, S.F. Ventures",
    rating: 4,
    reviewText:
      "Great collaborator, very responsive. A few rounds of revisions but the end result was worth it.",
    createdAt: "2026-04-30T00:00:00Z",
    isFeatured: true,
  },
  {
    id: "mock-review-4",
    name: "Diego Fernández",
    country: "Mexico",
    countryCode: "MX",
    position: "Owner, Flavour Fusion",
    rating: 5,
    reviewText:
      "Our online orders tripled after the new site launched. Couldn't be happier with the result.",
    createdAt: "2026-03-22T00:00:00Z",
    isFeatured: true,
  },
  {
    id: "mock-review-5",
    name: "Hana Kobayashi",
    country: "Japan",
    countryCode: "JP",
    position: "Marketing Director, Apex Fitness",
    rating: 5,
    reviewText:
      "Professional from kickoff to launch. The app has completely changed how our members book classes.",
    createdAt: "2026-02-10T00:00:00Z",
    isFeatured: true,
  },
  {
    id: "mock-review-6",
    name: "Tom Whitfield",
    country: "United Kingdom",
    countryCode: "GB",
    rating: 4,
    reviewText:
      "Solid work overall, and easy to reach when we had questions mid-project.",
    createdAt: "2026-01-15T00:00:00Z",
  },
];
