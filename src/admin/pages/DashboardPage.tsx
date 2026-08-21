import {
  CreditCard,
  FolderKanban,
  HelpCircle,
  Newspaper,
  Tags,
  Wrench,
} from "lucide-react";
import Badge from "@/client/components/ui/Badge";
import Card from "@/admin/components/ui/Card";
import StatCard from "@/admin/components/ui/StatCard";
import useAuth from "@/admin/context/useAuth";
import { useProjects } from "@/admin/hooks/useProjects";
import { useArticles } from "@/admin/hooks/useArticles";
import { useServices } from "@/admin/hooks/useServices";
import { useTags } from "@/admin/hooks/useTags";
import { usePricingPlans } from "@/admin/hooks/usePricing";
import { useFaqs } from "@/admin/hooks/useFaqs";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";

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
    { label: "Projects", href: "/admin/projects", icon: FolderKanban, value: projects.data?.total },
    { label: "Articles", href: "/admin/articles", icon: Newspaper, value: articles.data?.total },
    { label: "Services", href: "/admin/services", icon: Wrench, value: services.data?.total },
    { label: "Tags", href: "/admin/tags", icon: Tags, value: tags.data?.total },
    { label: "Pricing plans", href: "/admin/pricing", icon: CreditCard, value: pricingPlans.data?.total },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, value: faqs.data?.total },
  ];

  if (!user) return null;

  const details = [
    { label: "Email", value: user.email },
    { label: "Member since", value: formatDate(user.createdAt) },
    { label: "Last sign-in", value: formatDate(user.lastLoginAt) },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Welcome back, {user.firstName}.
      </h1>
      <p className="text-sm text-text-muted mb-8">
        You are signed in to the FrostWoodTech Web CMS.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="subtle">{roleLabel(user.role)}</Badge>
          <Badge variant="outline">{statusLabel(user.status)}</Badge>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-1">
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
