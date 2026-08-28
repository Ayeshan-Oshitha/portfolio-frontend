import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/client/components/ui/Button";
import ServiceTypeSelector from "./ServiceTypeSelector";
import FormField from "./FormField";
import type { ContactData } from "@/client/types";

interface ContactFormProps {
  readonly data: ContactData;
}

export default function ContactForm({ data }: ContactFormProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(data.formFields.map((field) => [field.id, ""])),
  );

  const handleServiceToggle = useCallback((serviceType: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceType)
        ? prev.filter((s) => s !== serviceType)
        : [...prev, serviceType],
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
    [selectedServices, formValues],
  );

  return (
    <div className="rounded-[22px] border border-card-br bg-card p-8 shadow-card sm:p-10">
      <h2 className="font-display text-[26px] font-medium tracking-[-0.018em] text-text-primary">
        Start a project
      </h2>
      <p className="mt-2 text-[14.5px] text-text-secondary">
        Everything except the message is optional — but the more we know, the
        sharper the quote.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-7">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.formFields
            .filter((field) => field.type !== "textarea")
            .map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={formValues[field.id] ?? ""}
                onChange={handleFieldChange}
              />
            ))}
        </div>

        <div className="mb-6">
          <ServiceTypeSelector
            serviceTypes={data.serviceTypes}
            selected={selectedServices}
            onToggle={handleServiceToggle}
          />
        </div>

        <div className="mb-7 grid grid-cols-1">
          {data.formFields
            .filter((field) => field.type === "textarea")
            .map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={formValues[field.id] ?? ""}
                onChange={handleFieldChange}
              />
            ))}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          icon={<ArrowRight size={16} />}
        >
          Send it over
        </Button>

        <p className="mt-3.5 text-center text-[13px] text-text-muted">
          We reply to every enquiry within one working day.
        </p>
      </form>
    </div>
  );
}
