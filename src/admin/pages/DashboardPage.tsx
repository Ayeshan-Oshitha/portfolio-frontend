import {
  CreditCard,
  FolderKanban,
  HelpCircle,
  Newspaper,
  Tags,
  Wrench,
} from "lucide-react";
import useAuth from "@/admin/context/useAuth";
import { useProjects } from "@/admin/hooks/useProjects";
import { useArticles } from "@/admin/hooks/useArticles";
import { useServices } from "@/admin/hooks/useServices";
import { useTags } from "@/admin/hooks/useTags";
import { usePricingPlans } from "@/admin/hooks/usePricing";
import { useFaqs } from "@/admin/hooks/useFaqs";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";
import {
  Badge,
  Card,
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/admin/components/ui";

/** A single-row fetch just to read `total` — the list itself is unused here. */
const COUNT_ONLY = { page: 1, pageSize: 1 };

export default function DashboardPage() {
  const { user } = useAuth();

  const projects = useProjects(COUNT_ONLY);
  const articles = useArticles(COUNT_ONLY);
  const services = useServices(COUNT_ONLY);
  const tags = useTags(COUNT_ONLY);
  const pricingPlans = usePricingPlans(COUNT_ONLY);
  const faqs = useFaqs(COUNT_ONLY);

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
    { label: "Tags", href: "/admin/tags", icon: Tags, value: tags.data?.total },
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
  ];

  if (!user) return null;

  const details = [
    { label: "Email", value: user.email },
    { label: "Member since", value: formatDate(user.createdAt) },
    { label: "Last sign-in", value: formatDate(user.lastLoginAt) },
  ];

  return (
    <div className="max-w-6xl">
      <PageHeader
        title={`Welcome back, ${user.firstName}.`}
        description="Everything published on the FrostWoodTech site is managed from here."
      />

      <SectionTitle description="Counts across every content type. Select one to manage it.">
        Content
      </SectionTitle>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <SectionTitle>Your account</SectionTitle>

      <Card padding="md">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge tone="brand">{roleLabel(user.role)}</Badge>
          <Badge variant="outline">{statusLabel(user.status)}</Badge>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-secondary mb-1.5">
                {label}
              </dt>
              <dd className="text-sm text-text-primary break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
