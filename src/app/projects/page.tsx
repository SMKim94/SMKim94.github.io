import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <DashboardLayout title="Projects">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Projects</span>
        </h1>

        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.title}
              className="flex flex-col rounded-xl border border-border p-5 transition-all hover:border-accent hover:bg-accent/5"
            >
              <h2 className="font-semibold">{project.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-3 text-sm">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    GitHub &rarr;
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Demo &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
