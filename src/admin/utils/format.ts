import type {
  ContactBudgetRange,
  ContactSubmissionStatus,
  PriceType,
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

/** Two initials for an account avatar, falling back to the email. */
export function initialsOf(
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim();
  return (initials || email?.[0] || "?").toUpperCase();
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

/** Delivery is free text only — there's no separate numeric days field. */
export function formatDelivery(plan: { readonly deliveryText?: string }): string {
  return plan.deliveryText ?? "—";
}

const CONTACT_STATUS_LABELS: Record<ContactSubmissionStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
  spam: "Spam",
};

export function contactStatusLabel(status: ContactSubmissionStatus): string {
  return CONTACT_STATUS_LABELS[status] ?? status;
}

const CONTACT_BUDGET_RANGE_LABELS: Record<ContactBudgetRange, string> = {
  under_one_k: "Under $1k",
  one_to_five_k: "$1k–$5k",
  five_to_fifteen_k: "$5k–$15k",
  over_fifteen_k: "$15k+",
  not_sure: "Not sure",
};

export function contactBudgetRangeLabel(range: ContactBudgetRange): string {
  return CONTACT_BUDGET_RANGE_LABELS[range] ?? range;
}
