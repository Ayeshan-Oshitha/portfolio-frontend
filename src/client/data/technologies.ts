import {
  Html5Icon,
  Css3Icon,
  JavaScriptIcon,
  TypeScriptIcon,
  JavaIcon,
  CSharpIcon,
  PythonIcon,
  ReactIcon,
  NextJsIcon,
  TailwindIcon,
  NodeJsIcon,
  NestJsIcon,
  DotNetIcon,
  MongoDbIcon,
  PostgreSqlIcon,
  MySqlIcon,
  MsSqlServerIcon,
  RedisIcon,
  AwsIcon,
  AzureIcon,
  DockerIcon,
  LinuxIcon,
  NginxIcon,
  GitIcon,
  GitHubIcon,
  FigmaIcon,
  FirebaseIcon,
  SupabaseIcon,
} from "@/client/assets/icons";

import type {
  TechnologyCategoryData,
  SectionHeaderConfig,
} from "@/client/types";

export const TECHNOLOGIES_HEADER: SectionHeaderConfig = {
  badge: "Technologies",
  title: "Tools &\nTechnologies",
  subtitle:
    "A comprehensive toolkit for building modern, scalable web applications.",
} as const;

export const TECHNOLOGY_CATEGORIES: readonly TechnologyCategoryData[] = [
  {
    category: "Languages",
    items: [
      { name: "HTML5", icon: Html5Icon },
      { name: "CSS3", icon: Css3Icon },
      { name: "JavaScript", icon: JavaScriptIcon },
      { name: "TypeScript", icon: TypeScriptIcon },
      { name: "Java", icon: JavaIcon },
      { name: "C#", icon: CSharpIcon },
      { name: "Python", icon: PythonIcon },
    ],
  },
  {
    category: "Frontend Development",
    items: [
      { name: "React", icon: ReactIcon },
      { name: "Next.js", icon: NextJsIcon },
      { name: "Tailwind CSS", icon: TailwindIcon },
    ],
  },
  {
    category: "Backend Development",
    items: [
      { name: "Node.js", icon: NodeJsIcon },
      { name: "NestJS", icon: NestJsIcon },
      { name: ".NET", icon: DotNetIcon },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "PostgreSQL", icon: PostgreSqlIcon },
      { name: "MS SQL Server", icon: MsSqlServerIcon },
      { name: "MongoDB", icon: MongoDbIcon },
      { name: "MySQL", icon: MySqlIcon },
      { name: "Redis", icon: RedisIcon },
    ],
  },
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS", icon: AwsIcon },
      { name: "Azure", icon: AzureIcon },
      { name: "Docker", icon: DockerIcon },
      { name: "Linux", icon: LinuxIcon },
      { name: "Nginx", icon: NginxIcon },
    ],
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", icon: GitIcon },
      { name: "GitHub", icon: GitHubIcon },
      { name: "Figma", icon: FigmaIcon },
      { name: "Firebase", icon: FirebaseIcon },
      { name: "Supabase", icon: SupabaseIcon },
    ],
  },
] as const;
