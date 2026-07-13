import type { ContactData } from "@/portfolio/types";

export const CONTACT_DATA: ContactData = {
  badge: "Get In Touch",
  headlinePrimary: "Ready To Work\nOn Your\n",
  headlineHighlight: "Website",
  headlineSuffix: "?",
  description:
    "Provide as many details as possible, and expect a response within 24 hours.",
  email: "hello@yourdomain.com",
  serviceTypes: ["Web Design", "Web Development", "Content & SEO", "Other"],
  formFields: [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "John",
      required: true,
      halfWidth: true,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Doe",
      required: true,
      halfWidth: true,
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "(555) 123-4567",
      required: false,
      halfWidth: true,
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "john@example.com",
      required: true,
      halfWidth: true,
    },
    {
      id: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Tell me about your project...",
      required: true,
      halfWidth: false,
    },
  ],
} as const;
