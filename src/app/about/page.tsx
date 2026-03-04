import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "HTML/CSS",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">About</h1>
        <p className="mt-4 text-muted">
          안녕하세요. 개발자 SM입니다.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-border px-3 py-1 text-sm text-muted"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Experience</h2>
        <div className="mt-3 text-sm text-muted">
          <p>내용을 추가해주세요.</p>
        </div>
      </section>
    </div>
  );
}
