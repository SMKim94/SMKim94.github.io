import type { Metadata } from "next";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export const metadata: Metadata = {
  title: "About",
};

const skills = [
  { category: "Frontend", items: ["JavaScript", "TypeScript", "React", "Next.js"] },
  { category: "Styling", items: ["Tailwind CSS", "CSS", "HTML"] },
  { category: "Backend", items: ["Node.js"] },
  { category: "Tools", items: ["Git", "GitHub"] },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Header */}
      <section className="flex flex-col gap-4">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">About</p>
        </div>
        <h1 className="animate-fade-in-up delay-100 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">SM</span>에 대해
        </h1>
        <p className="animate-fade-in-up delay-200 text-lg text-muted">
          안녕하세요. 개발자 SM입니다.
        </p>
      </section>

      {/* Skills */}
      <section>
        <ScrollFadeIn>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
            Skills
          </h2>
        </ScrollFadeIn>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((group, i) => (
            <ScrollFadeIn key={group.category} delay={i * 100}>
              <div className="card-glow rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-semibold text-accent">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="tag rounded-full border border-border px-3 py-1 text-sm text-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <ScrollFadeIn>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
            Experience
          </h2>
        </ScrollFadeIn>
        <ScrollFadeIn delay={100}>
          <div className="card-glow rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted">내용을 추가해주세요.</p>
          </div>
        </ScrollFadeIn>
      </section>
    </div>
  );
}
