import {
  CreditCard,
  FolderKanban,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Tags,
  UserCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly end: boolean;
  readonly superAdminOnly?: boolean;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

/**
 * Sidebar navigation, lifted out of `AdminLayout` so the layout file is
 * markup and the route list is data — and so `Topbar` can reuse it to label
 * breadcrumbs without importing the layout.
 */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "People",
    items: [
      {
        to: "/admin/users",
        label: "Users",
        icon: Users,
        end: false,
        superAdminOnly: true,
      },
      {
        to: "/admin/approvals",
        label: "Approvals",
        icon: UserCheck,
        end: false,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        to: "/admin/projects",
        label: "Projects",
        icon: FolderKanban,
        end: false,
      },
      { to: "/admin/articles", label: "Articles", icon: Newspaper, end: false },
      { to: "/admin/tags", label: "Tags", icon: Tags, end: false },
      { to: "/admin/services", label: "Services", icon: Wrench, end: false },
      { to: "/admin/pricing", label: "Pricing", icon: CreditCard, end: false },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, end: false },
      {
        to: "/admin/reviews",
        label: "Reviews",
        icon: MessageSquareQuote,
        end: false,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/admin/change-password",
        label: "Change password",
        icon: KeyRound,
        end: false,
      },
    ],
  },
];

/**
 * Path segment → human label, for the topbar breadcrumbs. Segments absent
 * here (an id, say) fall back to the raw segment.
 */
export const ROUTE_LABELS: Readonly<Record<string, string>> = {
  admin: "Dashboard",
  users: "Users",
  approvals: "Approvals",
  projects: "Projects",
  articles: "Articles",
  tags: "Tags",
  services: "Services",
  pricing: "Pricing",
  faqs: "FAQs",
  reviews: "Reviews",
  "change-password": "Change password",
  new: "New",
};
