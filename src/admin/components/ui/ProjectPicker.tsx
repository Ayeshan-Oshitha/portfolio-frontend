import { useMemo } from "react";
import { X } from "lucide-react";
import Spinner from "./Spinner";
import { FIELD_LABEL } from "./fieldClasses";
import Select from "./Select";
import { useProjects } from "@/admin/hooks/useProjects";
import { toErrorMessage } from "@/admin/api/ApiError";
import type { AdminProject } from "@/admin/types";

interface ProjectPickerProps {
  readonly label: string;
  /** The full set of selected ids — this replaces the service's case studies outright. */
  readonly value: readonly string[];
  readonly onChange: (ids: string[]) => void;
  readonly hint?: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

/** The API's page-size cap. A service picking from more than this would need its own paging. */
const PROJECT_PAGE_SIZE = 100;

/**
 * Multi-select for a service's linked case studies — same chips-plus-"add"-select shape as
 * `TagPicker`, backed by projects instead of tags. Drafts are included (an editor may want to
 * link one before it's published), and each option shows its year for disambiguation.
 */
export default function ProjectPicker({
  label,
  value,
  onChange,
  hint,
  error,
  containerClassName = "",
}: ProjectPickerProps) {
  const {
    data: result,
    isPending: isLoading,
    error: queryError,
  } = useProjects({ pageSize: PROJECT_PAGE_SIZE });
  const projects: readonly AdminProject[] = useMemo(
    () => result?.items ?? [],
    [result],
  );
  const loadError = queryError ? toErrorMessage(queryError) : null;

  // Chips follow `value`'s order; an id with no matching project is hidden but kept in the form value.
  const selected = useMemo(
    () =>
      value
        .map((id) => projects.find((project) => project.id === id))
        .filter((project): project is AdminProject => project !== undefined),
    [value, projects],
  );

  const options = useMemo(
    () =>
      projects
        .filter((project) => !value.includes(project.id))
        .map((project) => ({
          value: project.id,
          label: `${project.title} (${project.year})${project.isPublished ? "" : " — draft"}`,
        })),
    [projects, value],
  );

  const message = error ?? loadError;

  function add(id: string) {
    if (!id || value.includes(id)) return;
    onChange([...value, id]);
  }

  function remove(id: string) {
    onChange(value.filter((current) => current !== id));
  }

  return (
    <div className={containerClassName}>
      <span className={FIELD_LABEL}>{label}</span>

      {isLoading ? (
        <div className="flex items-center gap-3 py-3 text-sm text-text-muted">
          <Spinner className="h-4 w-4" label="Loading projects" />
          Loading projects…
        </div>
      ) : (
        <>
          {selected.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-3">
              {selected.map((project) => (
                <li key={project.id}>
                  <span className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 text-[11px] font-semibold tracking-tight rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                    {project.title}
                    <button
                      type="button"
                      onClick={() => remove(project.id)}
                      aria-label={`Remove ${project.title}`}
                      className="rounded-full p-0.5 hover:bg-primary-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Resets to the placeholder after each pick — reads as an "add" action, not a selection. */}
          <Select
            label="Add a project"
            placeholder={
              options.length === 0 ? "All projects added" : "Select a project"
            }
            options={options}
            value=""
            disabled={options.length === 0}
            onChange={(event) => add(event.target.value)}
          />
        </>
      )}

      {hint && !message && (
        <p className="mt-2 text-xs text-text-muted">{hint}</p>
      )}

      {message && <p className="mt-2 text-xs text-danger-400">{message}</p>}
    </div>
  );
}
