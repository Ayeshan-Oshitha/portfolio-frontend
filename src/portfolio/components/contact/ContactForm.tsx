import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import Button from "../ui/Button";
import ServiceTypeSelector from "./ServiceTypeSelector";
import FormField from "./FormField";
import type { ContactData } from "../../types";

interface ContactFormProps {
  readonly data: ContactData;
}

export default function ContactForm({ data }: ContactFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(data.formFields.map((field) => [field.id, ""]))
  );

  const handleServiceToggle = useCallback((serviceType: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceType)
        ? prev.filter((s) => s !== serviceType)
        : [...prev, serviceType]
    );
  }, []);

  const handleFieldChange = useCallback((id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // TODO: integrate with backend API
      console.log("Form submitted:", { selectedServices, formValues });
    },
    [selectedServices, formValues]
  );

  return (
    <div className="rounded-2xl bg-surface-900/60 border border-border-subtle p-8 sm:p-10">
      <form onSubmit={handleSubmit} noValidate>
        {/* Service type toggles */}
        <div className="mb-8">
          <ServiceTypeSelector
            serviceTypes={data.serviceTypes}
            selected={selectedServices}
            onToggle={handleServiceToggle}
          />
        </div>

        {/* Form fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {data.formFields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formValues[field.id] ?? ""}
              onChange={handleFieldChange}
            />
          ))}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={<Send size={16} />}
          className="w-full uppercase tracking-wider text-xs bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 border-0"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
