interface ServiceTypeSelectorProps {
  readonly serviceTypes: readonly string[];
  readonly selected: readonly string[];
  readonly onToggle: (serviceType: string) => void;
}

export default function ServiceTypeSelector({
  serviceTypes,
  selected,
  onToggle,
}: ServiceTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-text-primary mb-3">
        What can I help you with?
      </legend>
      <div className="flex flex-wrap gap-2">
        {serviceTypes.map((type) => {
          const isActive = selected.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggle(type)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase rounded-lg border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary-600/20 text-primary-400 border-primary-500/40"
                  : "bg-transparent text-text-secondary border-border-default hover:border-text-muted hover:text-text-primary"
              }`}
              aria-pressed={isActive}
            >
              {type}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
