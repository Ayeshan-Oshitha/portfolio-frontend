import type { ApiArticle, ApiProject, BlogPost, Project } from "@/client/types";

const FALLBACK_PROJECT_IMAGE = "/images/projects/placeholder.webp";
const FALLBACK_BLOG_IMAGE = "/images/blog/placeholder.webp";
const WORDS_PER_MINUTE = 200;

export function mapApiProjectToProject(
  api: ApiProject,
  index: number,
): Project {
  const categories = api.tags.filter((t) => !t.isTechnology).map((t) => t.name);
  const technologies = api.tags
    .filter((t) => t.isTechnology)
    .map((t) => t.name);
  const primaryImage = api.images.find((img) => img.isPrimary) ?? api.images[0];

  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    tagline: api.shortDescription,
    description: api.description,
    year: api.year,
    index,
    tags: [...categories, ...technologies],
    categories,
    technologies,
    imagePlaceholder: primaryImage?.url ?? FALLBACK_PROJECT_IMAGE,
    href: `/work/${api.slug}`,
    websiteUrl: api.websiteUrl,
    clientName: api.clientName,
    problem: api.problem,
    solution: api.solution,
    whatWeDelivered: api.whatWeDelivered,
    proof: api.proof,
    images: [...api.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        id: img.id,
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder,
      })),
  };
}

function estimateReadTime(markdown?: string): string {
  if (!markdown) return "1 min read";
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function formatPublishedDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// The backend never resolves `coverImageKey` to a public URL on this DTO
// (unlike `contentMarkdown`'s media:// tokens), so only treat it as usable
// when it already looks like a real URL.
function resolveCoverImage(coverImageKey?: string): string {
  if (coverImageKey && /^https?:\/\//.test(coverImageKey)) return coverImageKey;
  return FALLBACK_BLOG_IMAGE;
}

export function mapApiArticleToBlogPost(api: ApiArticle): BlogPost {
  const slug = api.slug ?? api.id;
  return {
    id: api.id,
    slug,
    title: api.title,
    excerpt: api.excerpt,
    category: api.tags[0]?.name ?? "General",
    date: formatPublishedDate(api.publishedDate),
    readTime: estimateReadTime(api.contentMarkdown),
    imagePlaceholder: resolveCoverImage(api.coverImageKey),
    href: `/blog/${slug}`,
    contentMarkdown: api.contentMarkdown,
    mediumUrl: api.mediumUrl,
  };
}
