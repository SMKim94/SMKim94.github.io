import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        About
      </h1>
      <div className="mt-8 space-y-6 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>
          안녕하세요! 저는 SM입니다. 소프트웨어 개발에 열정을 가지고 있으며,
          새로운 기술을 배우고 적용하는 것을 좋아합니다.
        </p>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "TypeScript",
            "React",
            "Next.js",
            "Node.js",
            "Tailwind CSS",
            "Git",
          ].map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Contact
        </h2>
        <p>
          궁금한 점이 있으시면{" "}
          <a
            href="https://github.com/SMKim94"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline underline-offset-4 dark:text-blue-400"
          >
            GitHub
          </a>
          를 통해 연락해주세요.
        </p>
      </div>
    </div>
  );
}
