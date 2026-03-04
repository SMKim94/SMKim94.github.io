export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Website",
    description: "Next.js로 만든 개인 웹사이트. GitHub Pages에 정적 배포.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/SMkim94/SMkim94.github.io",
  },
];
