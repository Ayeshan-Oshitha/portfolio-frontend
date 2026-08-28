import type { ContactData, ProcessStep } from "@/client/types";

export const CONTACT_DATA: ContactData = {
  badge: "Contact",
  title: "Tell us what\nyou're building.",
  description:
    "A scoped proposal and a fixed price within three working days — or an honest \u201cwe're not the right fit for this\u201d.",
  email: "[hello@frostwoodtech.com]",
  phone: "[+00 000 000 0000]",
  location: "[CITY, COUNTRY] — remote worldwide",
  availability: "Taking new projects — next start date [MONTH YEAR]",
  serviceTypes: [
    "SaaS product",
    "Website",
    "E-commerce",
    "Mobile app",
    "Design system",
    "SEO",
    "Not sure yet",
  ],
  formFields: [
    {
      id: "name",
      label: "Your name",
      type: "text",
      placeholder: "Jane Doe",
      required: true,
      halfWidth: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "jane@company.com",
      required: true,
      halfWidth: true,
    },
    {
      id: "company",
      label: "Company",
      type: "text",
      placeholder: "Company name",
      required: false,
      halfWidth: true,
    },
    {
      id: "budget",
      label: "Budget range",
      type: "select",
      placeholder: "Select a range",
      required: false,
      halfWidth: true,
      options: [
        "Under $5,000",
        "$5,000 – $15,000",
        "$15,000 – $40,000",
        "$40,000+",
        "Not sure yet",
      ],
    },
    {
      id: "message",
      label: "Tell us about it",
      type: "textarea",
      placeholder:
        "What are you building, who is it for, and what does success look like six months after launch?",
      required: true,
      halfWidth: false,
    },
  ],
} as const;

export const CONTACT_STEPS: readonly ProcessStep[] = [
  {
    id: "reply",
    step: "01",
    title: "We reply within a day",
    description:
      "A real person reads it. If we are not the right fit we will say so immediately and point you somewhere better.",
  },
  {
    id: "call",
    step: "02",
    title: "A 30-minute call",
    description:
      "No pitch deck. We ask about the problem, the users and the constraints, and tell you what we would do.",
  },
  {
    id: "proposal",
    step: "03",
    title: "A written proposal",
    description:
      "Scope, milestones, timeline and a fixed price — within three working days of the call. Yours to keep either way.",
  },
] as const;
