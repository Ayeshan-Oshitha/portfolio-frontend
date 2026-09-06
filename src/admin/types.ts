/**
 * Mirrors the DTOs exposed by FrostWoodTech Web.API (Azure Functions).
 * JSON is camelCase; enums are serialised as snake_case strings.
 */

export type UserRole = "super_admin" | "admin";

export type UserStatus =
  | "email_verification_required"
  | "pending"
  | "approved"
  | "rejected"
  | "disabled";

/** `DTOs/Admin/AdminUserResponse.cs` */
export interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  /** Omitted entirely by the API when the user has never signed in. */
  readonly lastLoginAt?: string;
  /** Set once the account is approved; the API omits it otherwise. */
  readonly approvedAt?: string;
  /** Only set when `status` is `rejected`. */
  readonly rejectionReason?: string;
  readonly createdAt: string;
}

/** `DTOs/Admin/RejectUserRequest.cs` */
export interface RejectUserRequest {
  readonly reason: string;
}

/**
 * `DTOs/Admin/AuthResponse.cs`. `expiresAt` is an absolute ISO-8601 timestamp with offset.
 * The refresh token never appears here — it rides along as an httpOnly cookie.
 */
export interface AuthResponse {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly user: AdminUser;
}

/** `DTOs/Admin/GoogleSignInRequest.cs` */
export interface GoogleSignInRequest {
  readonly idToken: string;
}

export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

/** `DTOs/Admin/VerifyEmailRequest.cs` */
export interface VerifyEmailRequest {
  readonly token: string;
}

/** `DTOs/Admin/ResendVerificationRequest.cs` */
export interface ResendVerificationRequest {
  readonly email: string;
}

/**
 * `DTOs/Admin/ResendVerificationResponse.cs` — always the same generic
 * message, whatever the email resolves to.
 */
export interface ResendVerificationResponse {
  readonly message: string;
}

export interface ChangePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmNewPassword: string;
}

/** `DTOs/Admin/ForgotPasswordRequest.cs` */
export interface ForgotPasswordRequest {
  readonly email: string;
}

/**
 * `DTOs/Admin/ForgotPasswordResponse.cs` — always the same generic message,
 * whatever the email resolves to.
 */
export interface ForgotPasswordResponse {
  readonly message: string;
}

/** `DTOs/Admin/SetPasswordRequest.cs` — used by both password-reset and account-setup links. */
export interface SetPasswordRequest {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
}

/** `Enums/TechCategory.cs` — serialised as its snake_case name. */
export type TechCategory =
  | "frontend"
  | "backend"
  | "language"
  | "database"
  | "tool_or_platform"
  | "cloud_devops"
  | "ai_ml_dl"
  | "agentic_ai"
  | "design"
  | "other";

/** `DTOs/Admin/TechCategoryOption.cs` — the fixed `TechCategory` list, value plus display label. */
export interface TechCategoryOption {
  readonly value: TechCategory;
  readonly label: string;
}

/**
 * `DTOs/Admin/AdminTagResponse.cs` — one table backs both project categories
 * and technologies, told apart by `isTechnology`. The API omits null members
 * entirely, hence the optional fields.
 */
export interface AdminTag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly isTechnology: boolean;
  /** Required by the API when `isTechnology`, absent otherwise. */
  readonly technologyCategory?: TechCategory;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateTagRequest.cs` and `UpdateTagRequest.cs` share this shape.
 * PUT is a full replacement, so an edit has to send every field.
 */
export interface TagWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly isTechnology: boolean;
  readonly technologyCategory?: TechCategory;
}

/** `Common/PagedResult.cs` — pageSize is clamped 1..100 server-side. */
export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

/** Stable `code` extension member on the API's RFC 7807 responses. */
export type ApiErrorCode =
  | "validation_failed"
  | "invalid_credentials"
  | "unauthenticated"
  | "invalid_token"
  | "account_disabled"
  | "email_verification_required"
  | "account_pending"
  | "account_rejected"
  | "invalid_verification_token"
  | "verification_token_expired"
  | "invalid_setup_token"
  | "setup_token_already_used"
  | "setup_token_expired"
  | "email_taken"
  | "cannot_delete_self"
  | "user_not_found"
  | "site_required"
  | "slug_taken"
  | "tag_in_use"
  | "not_found"
  | "cannot_modify_self"
  | "cannot_modify_super_admin"
  | "forbidden";

/** `Common/ProblemResults.cs` */
export interface ApiProblem {
  readonly status?: number;
  readonly title?: string;
  readonly detail?: string;
  readonly code?: ApiErrorCode | string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** `Enums/Site.cs` — the two public frontends, serialised lowercase. */
export type Site = "agency" | "personal";

/**
 * `DTOs/Admin/AdminArticleResponse.cs` — visibility is a pair of flags per
 * site rather than a status enum. Null members are omitted by the API, hence
 * the optionals.
 */
export interface AdminArticle {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly slug?: string;
  /** Set the first time the article is published; never cleared afterwards. */
  readonly publishedAt?: string;
  readonly coverImageKey?: string;
  /** Raw Markdown, `media://articles/...` tokens unresolved — this is what the editor edits. */
  readonly contentMarkdown?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly tags: readonly AdminTag[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateArticleRequest.cs`; `UpdateArticleRequest` extends it
 * unchanged. PUT is a full replacement — omitted booleans land as `false` and
 * an omitted `tagIds` wipes every tag, so an edit must send the whole shape.
 */
export interface ArticleWriteRequest {
  readonly title: string;
  readonly excerpt: string;
  /** Generated from the title by the API when omitted. */
  readonly slug?: string;
  readonly coverImageKey?: string;
  /** Raw Markdown, with embedded media as `media://articles/...` references. */
  readonly contentMarkdown?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  /** Always the full set — this replaces the article's tags outright. */
  readonly tagIds: readonly string[];
}

/** `Enums/PriceType.cs` — serialised as its snake_case name. */
export type PriceType =
  "fixed" | "starting_from" | "hourly" | "monthly" | "custom";

/** `DTOs/Public/PricingPlanFeatureResponse.cs` — shared by both views. */
export interface PricingPlanFeature {
  readonly id: string;
  readonly text: string;
  /** `false` renders as a struck-through "not included" bullet. */
  readonly isIncluded: boolean;
  readonly sortOrder: number;
}

/**
 * `DTOs/Admin/AdminPricingPlanResponse.cs` — one table backs both per-service
 * tiers and combo packs, told apart by `serviceId`: null means a combo pack.
 * A null `priceAmount` is the "Custom / Contact us" case. Agency-only —
 * pricing never appears on the personal site, so there is no `showOnX`/
 * `featuredOnX` pair, just one `featured` flag and one `sortOrder`, set only
 * via drag-and-drop. The API omits null members entirely, hence the optional
 * fields.
 */
export interface AdminPricingPlan {
  readonly id: string;
  /** Absent for a combo pack. */
  readonly serviceId?: string;
  readonly name: string;
  readonly tagline?: string;
  readonly priceAmount?: number;
  /** ISO 4217, upper-cased by the API. */
  readonly currency: string;
  readonly priceType: PriceType;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  /** Home page card flag — agency-only, so there's no per-site pair. */
  readonly featured: boolean;
  /** Drag-and-drop order — never a typed number on create/update. */
  readonly sortOrder: number;
  readonly features: readonly PricingPlanFeature[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreatePricingPlanRequest.cs`; `UpdatePricingPlanRequest` extends
 * it unchanged. PUT is a full replacement — an omitted boolean lands as
 * `false`, so an edit must send the whole shape. Features are a separate
 * sub-resource and are not part of this body. No `sortOrder` here — a new
 * plan is appended to the end of its group's order server-side, and an
 * existing one's position only changes via `reorderPricingPlans`.
 */
export interface PricingPlanWriteRequest {
  /** Omit for a combo pack. */
  readonly serviceId?: string;
  readonly name: string;
  readonly tagline?: string;
  /** Must be omitted when `priceType` is `custom`. */
  readonly priceAmount?: number;
  readonly currency: string;
  readonly priceType: PriceType;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
}

/**
 * `DTOs/Admin/PricingReorderRequest.cs` — no `site`: pricing is agency-only,
 * so there is only one order to keep.
 */
export interface PricingReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AddPricingPlanFeatureRequest.cs`; the update request extends it
 * unchanged. Features hang off a saved plan, so they need its id.
 */
export interface PricingFeatureWriteRequest {
  readonly text: string;
  readonly isIncluded: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/ReorderRequest.cs` — one entry per row being renumbered. */
export interface ReorderItem {
  readonly id: string;
  readonly sortOrder: number;
}

/** Sort order is kept per site, so the caller has to name the site. */
export interface ReorderRequest {
  readonly site: Site;
  readonly items: readonly ReorderItem[];
}

/** Features carry a single order, so their reorder body has no site. */
export interface FeatureReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AdminServiceResponse.cs` — the offering a pricing plan hangs
 * off. Visibility is a pair of flags per site rather than a status enum, and
 * `isPublished` is the separate draft switch on top. The API omits null
 * members entirely, hence the optional fields. Icon and hero image are each
 * an uploaded asset (Neon Object Storage), set together with their other
 * fields or not at all — same all-or-nothing rule as project images.
 */
/** `DTOs/Admin/ServiceProjectSummary.cs` — a linked project as the service form needs it. */
export interface ServiceProjectSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  readonly isPublished: boolean;
}

export interface AdminService {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** Markdown — the card blurb, and the fallback body when the page fields are empty. */
  readonly shortDescription: string;
  readonly eyebrow?: string;
  /** The page's H1. Falls back to `name` when absent. */
  readonly headline?: string;
  readonly deck?: string;
  /** Markdown bullet list. */
  readonly whoThisIsFor?: string;
  /** Markdown bullet list. */
  readonly outcomes?: string;
  /** Markdown bullet list. */
  readonly capabilities?: string;
  /** Markdown. */
  readonly inDepth?: string;
  readonly primaryCtaLabel?: string;
  readonly primaryCtaUrl?: string;
  readonly secondaryCtaLabel?: string;
  readonly secondaryCtaUrl?: string;
  readonly iconObjectKey?: string;
  readonly iconUrl?: string;
  readonly iconWidth?: number;
  readonly iconHeight?: number;
  readonly iconAltText?: string;
  readonly heroImageObjectKey?: string;
  readonly heroImageUrl?: string;
  readonly heroImageWidth?: number;
  readonly heroImageHeight?: number;
  readonly heroImageAltText?: string;
  readonly depthImageObjectKey?: string;
  readonly depthImageUrl?: string;
  readonly depthImageWidth?: number;
  readonly depthImageHeight?: number;
  readonly depthImageAltText?: string;
  /** Linked case studies, shown newest year first. */
  readonly projects: readonly ServiceProjectSummary[];
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly isPublished: boolean;
  /** Stamped the first time the service goes live; unpublishing never clears it. */
  readonly publishedAt?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateServiceRequest.cs`; `UpdateServiceRequest` extends it
 * unchanged. PUT is a full replacement — an omitted boolean lands as `false`
 * and an omitted number as `0`, so an edit must send the whole shape. Show/
 * featured/sort are carried forward from the loaded service rather than
 * edited in this form — that lives on the reorder & visibility screen.
 */
export interface ServiceWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly shortDescription: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly deck?: string;
  readonly whoThisIsFor?: string;
  readonly outcomes?: string;
  readonly capabilities?: string;
  readonly inDepth?: string;
  /** Set together with primaryCtaUrl, or not at all. */
  readonly primaryCtaLabel?: string;
  readonly primaryCtaUrl?: string;
  /** Set together with secondaryCtaUrl, or not at all. */
  readonly secondaryCtaLabel?: string;
  readonly secondaryCtaUrl?: string;
  /** Set together with the other icon* fields, or not at all. */
  readonly iconObjectKey?: string;
  readonly iconUrl?: string;
  readonly iconWidth?: number;
  readonly iconHeight?: number;
  /** Required whenever an icon is set. */
  readonly iconAltText?: string;
  /** Set together with the other heroImage* fields, or not at all. */
  readonly heroImageObjectKey?: string;
  readonly heroImageUrl?: string;
  readonly heroImageWidth?: number;
  readonly heroImageHeight?: number;
  /** Required whenever a hero image is set. */
  readonly heroImageAltText?: string;
  /** Set together with the other depthImage* fields, or not at all. */
  readonly depthImageObjectKey?: string;
  readonly depthImageUrl?: string;
  readonly depthImageWidth?: number;
  readonly depthImageHeight?: number;
  /** Required whenever a depth image is set. */
  readonly depthImageAltText?: string;
  /** The complete set of case studies — replaces the service's links outright. */
  readonly projectIds: readonly string[];
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
}

/**
 * `DTOs/Public/ProjectImageResponse.cs` — Neon Object Storage metadata only;
 * the API never stores bytes and never returns per-size URLs.
 */
export interface ProjectImage {
  readonly id: string;
  /** Neon object key. */
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  /** Exactly one per project — the card / hero image. */
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/**
 * `DTOs/Admin/AdminProjectResponse.cs` — the case-study record. Visibility is a
 * pair of flags per site rather than a status enum, and `isPublished` is the
 * separate draft switch on top. The API omits null members entirely, hence the
 * optional fields.
 */
export interface AdminProject {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  /** Card / list blurb. */
  readonly shortDescription: string;
  /** Markdown, long form. */
  readonly description: string;
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly isPublished: boolean;
  /** Stamped the first time the project goes live; unpublishing never clears it. */
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly tags: readonly AdminTag[];
  readonly images: readonly ProjectImage[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateProjectRequest.cs`; `UpdateProjectRequest` extends it
 * unchanged. PUT is a full replacement — an omitted boolean lands as `false`,
 * an omitted number as `0` and an omitted `tagIds` wipes every tag, so an edit
 * must send the whole shape. Images are a separate sub-resource and are not
 * part of this body.
 */
export interface ProjectWriteRequest {
  readonly title: string;
  /** Generated from the title by the API when omitted. */
  readonly slug?: string;
  /** Bounded 1990..currentYear + 1 by the API. */
  readonly year: number;
  readonly shortDescription: string;
  readonly description: string;
  /** Must be an absolute http(s) URL when given. */
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly isPublished: boolean;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  /** Always the full set — this replaces the project's tags outright. */
  readonly tagIds: readonly string[];
}

/**
 * `DTOs/Admin/SetPublishedRequest.cs` — flips the draft flag on its own so the
 * list can take a project live without resubmitting the whole form.
 */
export interface SetPublishedRequest {
  readonly isPublished: boolean;
}

/**
 * `DTOs/Admin/AddProjectImageRequest.cs`; `UpdateProjectImageRequest` extends
 * it unchanged. Setting `isPrimary` true clears the previous primary image.
 */
export interface ProjectImageWriteRequest {
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/ImageReorderRequest.cs` — a single global order, no site. */
export interface ImageReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `Enums/MediaTarget.cs` — which folder/validation rules a signature is for. */
export type MediaTarget =
  | "projects"
  | "services"
  | "tags"
  | "articles"
  | "certificates";

/**
 * `DTOs/Admin/PresignedUploadRequest.cs` — the current upload contract. The
 * server picks the folder from `target`, so the client never names a path.
 * `slug` is required when `target` is `projects` or `articles`.
 */
export interface PresignedUploadRequest {
  readonly target: MediaTarget;
  readonly slug?: string;
  /** Set to overwrite one specific object instead of adding a new one. */
  readonly objectKey?: string;
}

/**
 * `DTOs/Admin/PresignedUploadResponse.cs` — PUT the raw file bytes straight to
 * `uploadUrl` with a matching content type; the bytes never touch the API.
 */
export interface PresignedUploadResponse {
  readonly uploadUrl: string;
  readonly objectKey: string;
  /** Where the object reads back once the PUT lands — the API resolves it, the client can't. */
  readonly publicUrl: string;
  readonly expiresAt: string;
}

/**
 * `DTOs/Admin/MediaConfigResponse.cs` — prefix a `media://` token's key with
 * this (in place of `media://`) to get a loadable URL.
 */
export interface MediaConfigResponse {
  readonly publicBaseUrl: string;
}

/**
 * `DTOs/Admin/AdminFaqResponse.cs` — no `publishedAt` stamp and no dedicated
 * publish-toggle endpoint; `isPublished` only flips via a full update. Unlike
 * the other site-visible entities, FAQs have no featured flag and no
 * category — just the two visibility flags and one `sortOrder` shared across
 * both sites, set by dragging rows in the admin UI.
 */
export interface AdminFaq {
  readonly id: string;
  /** Absent means a general FAQ shared by both sites. */
  readonly serviceId?: string;
  /** For display next to the scope filter. Present exactly when `serviceId` is. */
  readonly serviceName?: string;
  readonly question: string;
  /** Markdown. */
  readonly answer: string;
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateFaqRequest.cs`; `UpdateFaqRequest` extends it unchanged.
 * PUT is a full replacement, so an edit has to send every field. No
 * `sortOrder` here — a new FAQ is appended to the end server-side, and an
 * existing one's position only changes via `reorderFaqs`.
 */
export interface FaqWriteRequest {
  /** Omit for a general FAQ shared by both sites; otherwise scopes it to that service's page. */
  readonly serviceId?: string;
  readonly question: string;
  readonly answer: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly showOnPersonal: boolean;
}

/** `DTOs/Admin/FaqReorderRequest.cs` — no `site`: FAQs share one order across both sites. */
export interface FaqReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AdminReviewResponse.cs` — draft state, featured flag, sort
 * order, and the submitter's IP for spam moderation. Reviews aren't split per
 * site, unlike articles/services/projects/FAQs.
 */
export interface AdminReview {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  /** ISO 3166-1 alpha-2, e.g. `US`. */
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly isPublished: boolean;
  readonly isFeatured: boolean;
  readonly sortOrder: number;
  /** Set for a public submission; omitted for a review an admin added by hand. */
  readonly submitterIp?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateReviewRequest.cs`; `UpdateReviewRequest` extends it
 * unchanged. PUT is a full replacement, so an edit has to send every field —
 * this is also how publish/unpublish and featuring both happen. No
 * `sortOrder` here — a new review is appended to the end server-side, and an
 * existing one's position only changes via `reorderReviews`.
 */
export interface ReviewWriteRequest {
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly isPublished: boolean;
  readonly isFeatured: boolean;
}

/** `DTOs/Admin/ReviewReorderRequest.cs` — reviews carry a single order, no site. */
export interface ReviewReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AdminCertificateResponse.cs` — personal-site only, so there is
 * no `showOnX`/`featuredOnX` pair, just one `featured` flag and one
 * `sortOrder`, same shape as pricing plans but agency's mirror image. The
 * uploaded file can be a PDF or an image, so `width`/`height` are absent
 * (the API omits null members) whenever it's a PDF.
 */
export interface AdminCertificate {
  readonly id: string;
  readonly name: string;
  readonly issuedBy: string;
  /** Date-only, `YYYY-MM-DD`. */
  readonly issuedDate: string;
  readonly marks?: string;
  readonly objectKey: string;
  readonly url: string;
  /** e.g. `application/pdf`, `image/png`. */
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly altText: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
  /** Drag-and-drop order — never a typed number on create/update. */
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateCertificateRequest.cs`; `UpdateCertificateRequest`
 * extends it unchanged. PUT is a full replacement, so an edit has to send
 * every field. No `sortOrder` here — a new certificate is appended to the
 * end of the single global order server-side, and an existing one's position
 * only changes via `reorderCertificates`.
 */
export interface CertificateWriteRequest {
  readonly name: string;
  readonly issuedBy: string;
  readonly issuedDate: string;
  readonly marks?: string;
  readonly objectKey: string;
  readonly url: string;
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly altText: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
}

/**
 * `DTOs/Admin/CertificateReorderRequest.cs` — no `site`: certificates only
 * ever exist for the personal site, so there is only one order to keep.
 */
export interface CertificateReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AdminCurrencyResponse.cs`. Two independent rates: `manualRateFromUsd` ("price set by
 * me," admin-typed, sticky) wins over `liveRateFromUsd` ("actual price," from the last refresh)
 * whenever both exist — `effectiveRateFromUsd` is whichever one a visitor actually converts at,
 * absent when neither exists yet. USD is the base: its manual rate is pinned to 1 and it can be
 * neither deactivated, renamed nor deleted.
 */
export interface AdminCurrency {
  readonly id: string;
  /** ISO 4217, upper-cased by the API. */
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  /** "Price set by me." Absent means the live rate is used instead. */
  readonly manualRateFromUsd?: number;
  /** "Actual price," as of the last refresh. Absent until one has run. */
  readonly liveRateFromUsd?: number;
  readonly liveRateFetchedAt?: string;
  /** What a visitor actually converts at. Absent means neither rate exists yet. */
  readonly effectiveRateFromUsd?: number;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateCurrencyRequest.cs`; `UpdateCurrencyRequest` extends it unchanged. PUT is a
 * full replacement, so an edit has to send every field. Only the manual override can be written
 * this way — the live rate only ever changes via `refreshCurrencyRates`.
 */
export interface CurrencyWriteRequest {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly manualRateFromUsd?: number;
  readonly isActive: boolean;
}

/** `DTOs/Admin/RefreshCurrencyRatesResponse.cs`. */
export interface RefreshCurrencyRatesResponse {
  readonly updatedCount: number;
  readonly fetchedAt: string;
}

/** `DTOs/Admin/AdminContactSubmissionResponse.cs`. `spam` is server-set (honeypot), never chosen by the submitter. */
export type ContactSubmissionStatus =
  | "new"
  | "read"
  | "replied"
  | "archived"
  | "spam";

/** Coarse, currency-free budget band on the contact form — qualifies a lead, not a quote. */
export type ContactBudgetRange =
  | "under_one_k"
  | "one_to_five_k"
  | "five_to_fifteen_k"
  | "over_fifteen_k"
  | "not_sure";

/**
 * `DTOs/Admin/AdminContactSubmissionResponse.cs` — everything the visitor sent, plus triage
 * state and the submitter's IP for spam moderation. Never public; there is no matching public
 * read endpoint, only `POST /public/contact`.
 */
export interface AdminContactSubmission {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly company?: string;
  readonly subject?: string;
  readonly message: string;
  /** The service the enquiry is about. Absent means a general enquiry. */
  readonly serviceId?: string;
  readonly serviceName?: string;
  readonly budgetRange?: ContactBudgetRange;
  readonly site: Site;
  readonly status: ContactSubmissionStatus;
  readonly adminNotes?: string;
  readonly repliedAt?: string;
  readonly repliedBy?: string;
  readonly submitterIp?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/UpdateContactSubmissionRequest.cs` — triage only. An admin can never rewrite what
 * the visitor actually submitted.
 */
export interface ContactSubmissionUpdateRequest {
  readonly status: ContactSubmissionStatus;
  readonly adminNotes?: string;
}
