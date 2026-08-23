import type {
  PriceType,
  TechCategory,
  UserRole,
  UserStatus,
} from "@/admin/types";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
};

const STATUS_LABELS: Record<UserStatus, string> = {
  email_verification_required: "Awaiting email verification",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  disabled: "Disabled",
};

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

export function statusLabel(status: UserStatus): string {
  return STATUS_LABELS[status] ?? status;
}

/** The API omits `lastLoginAt` entirely when the user has never signed in. */
export function formatDate(value?: string): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const TECH_CATEGORY_LABELS: Record<TechCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  language: "Language",
  database: "Database",
  tool_or_platform: "Tool / platform",
  cloud_devops: "Cloud & DevOps",
  ai_ml_dl: "AI / ML / DL",
  agentic_ai: "Agentic AI",
  design: "Design",
  other: "Other",
};

/** Every `TechCategory` in the order the API's enum declares them. */
export const TECH_CATEGORIES = Object.keys(
  TECH_CATEGORY_LABELS,
) as readonly TechCategory[];

export function techCategoryLabel(category: TechCategory): string {
  return TECH_CATEGORY_LABELS[category] ?? category;
}

/**
 * Preview only — the API generates the real slug with `SlugGenerator.Generate`
 * whenever the field is left blank, and its output is authoritative.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * `publishedDate` is a `DateOnly` (`YYYY-MM-DD`). Parsing it with `new Date`
 * would read it as UTC midnight and render the previous day west of Greenwich,
 * so the parts are split out and handed to a local-time constructor instead.
 */
export function formatDateOnly(value?: string): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "—";
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

/** Today as `YYYY-MM-DD` in local time — the default for a new article. */
export function todayDateOnly(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  fixed: "Fixed",
  starting_from: "Starting from",
  hourly: "Hourly",
  monthly: "Monthly",
  custom: "Custom",
};

export function priceTypeLabel(priceType: PriceType): string {
  return PRICE_TYPE_LABELS[priceType] ?? priceType;
}

/**
 * How a plan's price reads in the admin table. The API omits `priceAmount`
 * entirely for a `custom` plan, which is exactly the "talk to us" case, so an
 * absent amount is a value here rather than a gap.
 */
export function formatPrice(plan: {
  readonly priceAmount?: number;
  readonly currency: string;
  readonly priceType: PriceType;
}): string {
  if (plan.priceAmount === undefined) return "Contact us";

  const amount = plan.priceAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const money = `${plan.currency} ${amount}`;

  switch (plan.priceType) {
    case "starting_from":
      return `From ${money}`;
    case "hourly":
      return `${money}/hr`;
    case "monthly":
      return `${money}/mo`;
    default:
      return money;
  }
}

/** How long delivery takes, preferring the free-text override when set. */
export function formatDelivery(plan: {
  readonly deliveryDays?: number;
  readonly deliveryText?: string;
}): string {
  if (plan.deliveryText) return plan.deliveryText;
  if (plan.deliveryDays === undefined) return "—";
  return `${plan.deliveryDays} ${plan.deliveryDays === 1 ? "day" : "days"}`;
}
