import {
  Code2,
  Server,
  BrainCircuit,
  Smartphone,
  LayoutTemplate,
  Database,
} from "lucide-react";
import type { ServiceOffering, FAQ } from "@/portfolio/types";

export const SERVICES_DATA: readonly ServiceOffering[] = [
  {
    id: "srv-frontend",
    title: "Frontend Development",
    description:
      "Crafting pixel-perfect, highly interactive, and accessible user interfaces using modern React ecosystems.",
    icon: LayoutTemplate,
    features: [
      "React & Next.js Architecture",
      "Tailwind CSS & Framer Motion",
      "Responsive Web Design",
      "Web Performance Optimization",
    ],
  },
  {
    id: "srv-backend",
    title: "Backend Development",
    description:
      "Building scalable, secure, and robust server-side architectures and APIs to power your applications.",
    icon: Server,
    features: [
      "Node.js & Express / NestJS",
      "RESTful & GraphQL APIs",
      "Microservices Architecture",
      "Cloud Infrastructure (AWS/GCP)",
    ],
  },
  {
    id: "srv-ai",
    title: "AI Integrations",
    description:
      "Empowering your software with cutting-edge artificial intelligence, from LLMs to predictive models.",
    icon: BrainCircuit,
    features: [
      "OpenAI & Anthropic API Integration",
      "Custom RAG Pipelines",
      "AI-driven Process Automation",
      "Intelligent Chatbots",
    ],
  },
  {
    id: "srv-fullstack",
    title: "Full-Stack Applications",
    description:
      "End-to-end development handling both client and server for a seamless, cohesive product delivery.",
    icon: Code2,
    features: [
      "End-to-end Product Development",
      "Database Design & ORMs",
      "Authentication & Security",
      "CI/CD Pipelines",
    ],
  },
  {
    id: "srv-mobile",
    title: "Mobile Development",
    description:
      "Cross-platform mobile applications that provide native-like experiences on both iOS and Android.",
    icon: Smartphone,
    features: [
      "React Native Apps",
      "App Store Deployment",
      "Native API Integrations",
      "Offline-First Architecture",
    ],
  },
  {
    id: "srv-database",
    title: "Database Architecture",
    description:
      "Designing efficient schemas and optimizing queries to ensure your data layer scales seamlessly.",
    icon: Database,
    features: [
      "PostgreSQL & MySQL",
      "MongoDB & NoSQL",
      "Data Migration Strategies",
      "Query Optimization",
    ],
  },
] as const;

export const FAQ_DATA: readonly FAQ[] = [
  {
    id: "faq-1",
    question: "What technologies do you build with?",
    answer:
      "I specialize in the modern JavaScript/TypeScript ecosystem. For the frontend, I use React, Next.js, and Tailwind CSS. For the backend, I leverage Node.js, Express, and databases like PostgreSQL. I also have deep experience integrating AI models via OpenAI and Anthropic APIs.",
  },
  {
    id: "faq-2",
    question: "Can you build a custom web application?",
    answer:
      "Absolutely. I build custom, scalable web applications tailored exactly to your business logic. From internal dashboards to public-facing SaaS products, I handle the entire lifecycle from architecture to deployment.",
  },
  {
    id: "faq-3",
    question: "Do you take over existing codebases?",
    answer:
      "Yes, I frequently take over, refactor, and scale existing codebases. I begin with a thorough audit to understand the architecture, identify technical debt, and ensure a smooth transition before adding new features.",
  },
  {
    id: "faq-4",
    question: "How do you handle project communication?",
    answer:
      "I believe in radical transparency. I provide weekly status updates, maintain a shared task tracker, and am available via Slack or email for rapid async communication to ensure we are always aligned.",
  },
] as const;
