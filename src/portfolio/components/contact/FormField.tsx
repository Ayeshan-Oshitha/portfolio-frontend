import type { FormFieldConfig } from "@/portfolio/types";

interface FormFieldProps {
  readonly field: FormFieldConfig;
  readonly value: string;
  readonly onChange: (id: string, value: string) => void;
}

export default function FormField({ field, value, onChange }: FormFieldProps) {
  const baseInputClasses =
    "w-full px-4 py-3 text-sm text-text-primary bg-surface-950 border border-border-default rounded-lg placeholder:text-text-muted transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30";

  return (
    <div className={field.halfWidth ? "" : "col-span-full"}>
      <label
        htmlFor={field.id}
        className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-2"
      >
        {field.label}
        {field.required && (
          <span className="text-primary-400 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          name={field.id}
          rows={5}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={`${baseInputClasses} resize-none`}
        />
      ) : (
        <input
          id={field.id}
          name={field.id}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}
