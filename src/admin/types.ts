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
 * `DTOs/Admin/AuthResponse.cs`. `expiresAt`/`refreshTokenExpiresAt` are
 * absolute ISO-8601 timestamps with offset.
 */
export interface AuthResponse {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAt: string;
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
  readonly iconCloudinaryId?: string;
  readonly iconUrl?: string;
  /** `#rrggbb`, lowercased by the API. */
  readonly colorHex?: string;
  readonly sortOrder: number;
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
  readonly iconCloudinaryId?: string;
  readonly iconUrl?: string;
  readonly colorHex?: string;
  readonly sortOrder: number;
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

export interface StoredToken {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly refreshToken: string;
  readonly refreshTokenExpiresAt: string;
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
  /** `YYYY-MM-DD` — a `DateOnly`, not a timestamp. */
  readonly publishedDate: string;
  /** Optional cross-post link. Must be an absolute URL when present. */
  readonly mediumUrl?: string;
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
  readonly publishedDate: string;
  /** Optional cross-post link. Must be an absolute URL when present. */
  readonly mediumUrl?: string;
  readonly coverImageKey?: string;
  /** Raw Markdown, with embedded media as `media://articles/...` references. */
  readonly contentMarkdown?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
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
 * A null `priceAmount` is the "Custom / Contact us" case. The API omits null
 * members entirely, hence the optional fields.
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
  readonly deliveryDays?: number;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  /** Tier order within a service, applied after the per-site order. */
  readonly sortOrder: number;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly features: readonly PricingPlanFeature[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreatePricingPlanRequest.cs`; `UpdatePricingPlanRequest` extends
 * it unchanged. PUT is a full replacement — an omitted boolean lands as
 * `false` and an omitted number as `0`, so an edit must send the whole shape.
 * Features are a separate sub-resource and are not part of this body.
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
  readonly deliveryDays?: number;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  readonly sortOrder: number;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
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

/** `DTOs/Public/ServiceFeatureResponse.cs` — shared by both views. */
export interface ServiceFeature {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  /** A Lucide icon key, not a URL. */
  readonly iconName?: string;
  readonly sortOrder: number;
}

/**
 * `DTOs/Admin/AdminServiceResponse.cs` — the offering a pricing plan hangs
 * off. Visibility is a pair of flags per site rather than a status enum, and
 * `isPublished` is the separate draft switch on top. The API omits null
 * members entirely, hence the optional fields.
 */
export interface AdminService {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** Card text. */
  readonly shortDescription: string;
  /** Markdown, the service page body. */
  readonly description: string;
  /** A Lucide icon key. */
  readonly iconName?: string;
  /** Cloudinary `public_id` for an uploaded SVG/PNG icon. */
  readonly iconCloudinaryId?: string;
  readonly heroImageId?: string;
  readonly isPublished: boolean;
  /** Stamped the first time the service goes live; unpublishing never clears it. */
  readonly publishedAt?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly features: readonly ServiceFeature[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateServiceRequest.cs`; `UpdateServiceRequest` extends it
 * unchanged. PUT is a full replacement — an omitted boolean lands as `false`
 * and an omitted number as `0`, so an edit must send the whole shape.
 * Features are a separate sub-resource and are not part of this body.
 */
export interface ServiceWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly iconName?: string;
  readonly iconCloudinaryId?: string;
  readonly heroImageId?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
}

/**
 * `DTOs/Admin/AddServiceFeatureRequest.cs`; the update request extends it
 * unchanged. Features hang off a saved service, so they need its id.
 */
export interface ServiceFeatureWriteRequest {
  readonly title: string;
  readonly description?: string;
  readonly iconName?: string;
  readonly sortOrder: number;
}

/**
 * `DTOs/Public/ProjectImageResponse.cs` — Cloudinary metadata only; the API
 * never stores bytes and never returns per-size URLs.
 */
export interface ProjectImage {
  readonly id: string;
  /** Cloudinary `public_id`. */
  readonly cloudinaryId: string;
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
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
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
  readonly cloudinaryId: string;
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
export type MediaTarget = "projects" | "services" | "tags" | "articles";

/** `DTOs/Admin/UploadSignatureRequest.cs` — `slug` is required when `target` is `projects`. */
export interface UploadSignatureRequest {
  readonly target?: MediaTarget;
  readonly slug?: string;
  /** Set to overwrite an existing asset instead of creating a new one. */
  readonly publicId?: string;
}

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

/** `DTOs/Admin/UploadSignatureResponse.cs` — feeds a direct signed upload to Cloudinary. */
export interface UploadSignatureResponse {
  readonly signature: string;
  readonly timestamp: number;
  readonly apiKey: string;
  readonly cloudName: string;
  readonly folder: string;
  readonly publicId?: string;
  readonly uploadUrl: string;
}

/**
 * `DTOs/Admin/AdminFaqResponse.cs` — no `publishedAt` stamp and no dedicated
 * publish-toggle endpoint; `isPublished` only flips via a full update.
 */
export interface AdminFaq {
  readonly id: string;
  readonly question: string;
  /** Markdown. */
  readonly answer: string;
  readonly category?: string;
  readonly sortOrder: number;
  readonly isPublished: boolean;
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
 * `DTOs/Admin/CreateFaqRequest.cs`; `UpdateFaqRequest` extends it unchanged.
 * PUT is a full replacement, so an edit has to send every field.
 */
export interface FaqWriteRequest {
  readonly question: string;
  readonly answer: string;
  readonly category?: string;
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
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
 * this is also how publish/unpublish and featuring both happen.
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
  readonly sortOrder: number;
}

/** `DTOs/Admin/ReviewReorderRequest.cs` — reviews carry a single order, no site. */
export interface ReviewReorderRequest {
  readonly items: readonly ReorderItem[];
}
