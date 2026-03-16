export interface Project {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    title: "Personal Website",
    description:
      "Next.js와 Tailwind CSS로 만든 개인 웹사이트. 다크모드, 블로그, 프로젝트 소개 등을 포함합니다.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/SMKim94/SMKim94.github.io",
  },
];
