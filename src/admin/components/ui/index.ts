/**
 * Barrel for the admin design system.
 *
 * Pages import a lot of these at once — importing them one per line was
 * producing eight- and ten-line import blocks at the top of every CRUD page.
 */

export { default as Alert } from "./Alert";
export { default as Badge } from "./Badge";
export { default as BackLink } from "./BackLink";
export { default as Button } from "./Button";
export { default as Card } from "./Card";
export { default as Checkbox } from "./Checkbox";
export { default as ConfirmDialog } from "./ConfirmDialog";
export { default as DataTableShell } from "./DataTableShell";
export { default as EmptyState } from "./EmptyState";
export { default as FieldGroup } from "./FieldGroup";
export { default as IconButton } from "./IconButton";
export { default as Input } from "./Input";
export { default as LoadingState } from "./LoadingState";
export { default as Modal } from "./Modal";
export { default as PageHeader } from "./PageHeader";
export { default as Pagination } from "./Pagination";
export { default as SectionTitle } from "./SectionTitle";
export { default as Select } from "./Select";
export { default as Spinner } from "./Spinner";
export { default as StatCard } from "./StatCard";
export { default as StickyBar } from "./StickyBar";
export { default as TagPicker } from "./TagPicker";
export { default as Textarea } from "./Textarea";
export { default as TextLink } from "./TextLink";
export { default as ToastContainer } from "./ToastContainer";
export { default as Toolbar } from "./Toolbar";

export { Table, THead, TH, TBody, TR, TD } from "./Table";

export type { SelectOption } from "./Select";
export type * from "./types";
