import { useState } from "react";
import {
  Coins,
  CreditCard,
  FolderKanban,
  HelpCircle,
  Mail,
  Newspaper,
  Star,
  Tags,
  UserCheck,
  Wrench,
} from "lucide-react";
import useAuth from "@/admin/context/useAuth";
import { useProjects } from "@/admin/hooks/useProjects";
import { useArticles } from "@/admin/hooks/useArticles";
import { useServices } from "@/admin/hooks/useServices";
import { useTags } from "@/admin/hooks/useTags";
import { usePricingPlans } from "@/admin/hooks/usePricing";
import { useFaqs } from "@/admin/hooks/useFaqs";
import { useReviews } from "@/admin/hooks/useReviews";
import { useCurrencies } from "@/admin/hooks/useCurrencies";
import { useUsers } from "@/admin/hooks/useUsers";
import { useContactSubmissions } from "@/admin/hooks/useContactSubmissions";
import ContentBreakdownChart from "@/admin/components/dashboard/ContentBreakdownChart";
import { SectionTitle, StatCard } from "@/admin/components/ui";

/** A single-row fetch just to read `total` — the list itself is unused here. */
const COUNT_ONLY = { page: 1, pageSize: 1 };

type StatusFilter = "" | "published" | "draft";

const STATUS_TABS = [
  { value: "", label: "All content" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Unpublished" },
] as const;

function toIsPublished(status: StatusFilter): boolean | undefined {
  if (status === "published") return true;
  if (status === "draft") return false;
  return undefined;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<StatusFilter>("");
  const isPublished = toIsPublished(status);

  // Scoped to the agency site: projects/articles/services/FAQs can also show
  // on the personal site, but this breakdown is specifically "what's live on
  // FrostWoodTech" — pricing has no `site` param since it's agency-only by
  // design, and tags aren't site- or publish-scoped at all, so both sit
  // outside the filter.
  const projects = useProjects({ site: "agency", isPublished, ...COUNT_ONLY });
  const articles = useArticles({ site: "agency", isPublished, ...COUNT_ONLY });
  const services = useServices({ site: "agency", isPublished, ...COUNT_ONLY });
  const tags = useTags(COUNT_ONLY);
  const pricingPlans = usePricingPlans({ isPublished, ...COUNT_ONLY });
  const faqs = useFaqs({ site: "agency", isPublished, ...COUNT_ONLY });
  // Reviews are shared across both sites (not site-scoped), so only the
  // status filter applies here, same as pricing/tags.
  const reviews = useReviews({ isPublished, ...COUNT_ONLY });
  // Currencies have no published/draft concept — always the raw total.
  const currencies = useCurrencies(COUNT_ONLY);

  const isSuperAdmin = user?.role === "super_admin";
  // `GET /admin/users` is super-admin-only server-side — a regular admin
  // must never fire this request, not just hide the result.
  const pendingApprovals = useUsers(
    { status: "pending", ...COUNT_ONLY },
    isSuperAdmin,
  );
  const newContacts = useContactSubmissions({ status: "new", ...COUNT_ONLY });

  const alerts = [
    ...(isSuperAdmin
      ? [
          {
            label: "Pending approvals",
            href: "/admin/approvals",
            icon: UserCheck,
            value: pendingApprovals.data?.total,
          },
        ]
      : []),
    {
      label: "New contact messages",
      href: "/admin/contact-submissions",
      icon: Mail,
      value: newContacts.data?.total,
    },
  ].map((alert) => ({
    ...alert,
    tone: (alert.value ?? 0) > 0 ? ("warning" as const) : ("success" as const),
  }));

  const stats = [
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
      value: projects.data?.total,
    },
    {
      label: "Articles",
      href: "/admin/articles",
      icon: Newspaper,
      value: articles.data?.total,
    },
    {
      label: "Services",
      href: "/admin/services",
      icon: Wrench,
      value: services.data?.total,
    },
    {
      label: "Tags",
      href: "/admin/tags",
      icon: Tags,
      value: tags.data?.total,
    },
    {
      label: "Pricing plans",
      href: "/admin/pricing",
      icon: CreditCard,
      value: pricingPlans.data?.total,
    },
    {
      label: "FAQs",
      href: "/admin/faqs",
      icon: HelpCircle,
      value: faqs.data?.total,
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: Star,
      value: reviews.data?.total,
    },
    {
      label: "Currencies",
      href: "/admin/currencies",
      icon: Coins,
      value: currencies.data?.total,
    },
  ];

  if (!user) return null;

  return (
    <div>
      {/* Account status, email, and sign-in details now live in the topbar's
          account button (click it to open) — this stays a plain greeting.
          Set in Fraunces (the client site's display serif) at a normal
          weight/tracking rather than the shared `admin-display` utility's
          bold+tight treatment — that combination was tried on this exact
          heading before and reads as a dense, low-contrast block at this
          size (see the comment on `admin-display` in index.css), so this
          stays a one-off rather than reverting that utility everywhere. */}
      <h1
        className="mb-6 text-3xl leading-tight text-text-primary md:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Welcome back, {user.firstName}.
      </h1>

      <SectionTitle
        className="mb-2"
        description="Things that could use a look."
      >
        Needs attention
      </SectionTitle>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {alerts.map((alert) => (
          <StatCard key={alert.label} {...alert} />
        ))}
      </div>

      <SectionTitle
        className="mb-2"
        description="Agency-site counts across every content type. Select one to manage it."
      >
        Content
      </SectionTitle>

      <ContentBreakdownChart
        items={stats}
        tabs={STATUS_TABS}
        activeTab={status}
        onTabChange={(value) => setStatus(value as StatusFilter)}
      />
    </div>
  );
}
