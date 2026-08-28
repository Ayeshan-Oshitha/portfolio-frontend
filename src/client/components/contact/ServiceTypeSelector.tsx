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
      <legend className="mb-3 text-[13px] font-bold text-text-primary">
        What do you need?
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {serviceTypes.map((type) => {
          const isActive = selected.includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onToggle(type)}
              aria-pressed={isActive}
              className={`cursor-pointer rounded-[10px] px-4.5 py-2.5 text-[13.5px] transition-colors duration-200 ${
                isActive
                  ? "fw-btn font-bold"
                  : "border border-raise-br bg-raise font-semibold text-text-secondary hover:text-text-primary"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
