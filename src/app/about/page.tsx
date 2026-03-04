import type { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";

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
    <DashboardLayout title="About">
      <div className="mx-auto max-w-2xl flex flex-col gap-10">
        <section>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">SM</span>에 대해
          </h1>
          <p className="mt-3 text-muted">
            안녕하세요. 개발자 SM입니다.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Skills
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {skills.map((group) => (
              <div
                key={group.category}
                className="rounded-xl border border-border p-4"
              >
                <h3 className="text-sm font-semibold text-accent">
                  {group.category}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="tag rounded-full border border-border px-2.5 py-1 text-xs text-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">
            Experience
          </h2>
          <div className="mt-4 rounded-xl border border-border p-4">
            <p className="text-sm text-muted">내용을 추가해주세요.</p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
