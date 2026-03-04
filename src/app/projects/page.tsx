import type { Metadata } from "next";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">Portfolio</p>
        </div>
        <h1 className="animate-fade-in-up delay-100 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Projects</span>
        </h1>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ScrollFadeIn key={project.title} delay={i * 100}>
            <div className="card-glow flex h-full flex-col rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold">{project.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3 text-sm">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent transition-opacity hover:opacity-70"
                  >
                    GitHub &rarr;
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent transition-opacity hover:opacity-70"
                  >
                    Demo &rarr;
                  </a>
                )}
              </div>
            </div>
          </ScrollFadeIn>
        ))}
      </div>
    </div>
  );
}
