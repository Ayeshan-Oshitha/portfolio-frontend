import type { GetArticlesParams } from "@/admin/services/articlesService";
import type { GetProjectsParams } from "@/admin/services/projectsService";
import type { GetServicesParams } from "@/admin/services/servicesService";
import type { GetPricingPlansParams } from "@/admin/services/pricingService";
import type { GetTagsParams } from "@/admin/services/tagsService";
import type { GetUsersParams } from "@/admin/services/usersService";
import type { GetFaqsParams } from "@/admin/services/faqsService";
import type { GetReviewsParams } from "@/admin/services/reviewsService";
import type { GetCertificatesParams } from "@/admin/services/certificatesService";
import type { GetContactSubmissionsParams } from "@/admin/services/contactSubmissionsService";
import type { GetCurrenciesParams } from "@/admin/services/currenciesService";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const mediaKeys = {
  config: ["media", "config"] as const,
};

export const articleKeys = {
  all: ["articles"] as const,
  lists: () => [...articleKeys.all, "list"] as const,
  list: (params: GetArticlesParams) =>
    [...articleKeys.lists(), params] as const,
  detail: (id: string) => [...articleKeys.all, "detail", id] as const,
};

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (params: GetProjectsParams) =>
    [...projectKeys.lists(), params] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
};

export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (params: GetServicesParams) =>
    [...serviceKeys.lists(), params] as const,
  detail: (id: string) => [...serviceKeys.all, "detail", id] as const,
};

export const pricingKeys = {
  all: ["pricingPlans"] as const,
  lists: () => [...pricingKeys.all, "list"] as const,
  list: (params: GetPricingPlansParams) =>
    [...pricingKeys.lists(), params] as const,
  detail: (id: string) => [...pricingKeys.all, "detail", id] as const,
};

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (params: GetTagsParams) => [...tagKeys.lists(), params] as const,
};

export const techCategoryKeys = {
  all: ["techCategories"] as const,
};

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: GetUsersParams) => [...userKeys.lists(), params] as const,
};

export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  list: (params: GetFaqsParams) => [...faqKeys.lists(), params] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (params: GetReviewsParams) => [...reviewKeys.lists(), params] as const,
};

export const certificateKeys = {
  all: ["certificates"] as const,
  lists: () => [...certificateKeys.all, "list"] as const,
  list: (params: GetCertificatesParams) =>
    [...certificateKeys.lists(), params] as const,
};

export const currencyKeys = {
  all: ["currencies"] as const,
  lists: () => [...currencyKeys.all, "list"] as const,
  list: (params: GetCurrenciesParams) =>
    [...currencyKeys.lists(), params] as const,
};

export const contactSubmissionKeys = {
  all: ["contactSubmissions"] as const,
  lists: () => [...contactSubmissionKeys.all, "list"] as const,
  list: (params: GetContactSubmissionsParams) =>
    [...contactSubmissionKeys.lists(), params] as const,
  detail: (id: string) => [...contactSubmissionKeys.all, "detail", id] as const,
};
