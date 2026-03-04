import Link from "next/link";
import TypingText from "@/components/TypingText";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/data/projects";

const sections = [
  {
    href: "/about",
    title: "About",
    description: "저에 대해 알아보기",
    icon: "👤",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "만들어본 것들",
    icon: "🛠",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "기록하고 공유하기",
    icon: "✍️",
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="bg-gradient-subtle flex flex-col gap-20 py-8">
      {/* Hero */}
      <section className="flex flex-col gap-6 py-12">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Welcome
          </p>
        </div>
        <h1 className="animate-fade-in-up delay-100 text-4xl font-bold tracking-tight sm:text-5xl">
          안녕하세요,
          <br />
          <span className="gradient-text">SM</span>입니다.
        </h1>
        <div className="animate-fade-in-up delay-200 h-8 text-lg text-muted">
          <TypingText
            texts={[
              "코드를 작성합니다",
              "문제를 해결합니다",
              "새로운 것을 만듭니다",
            ]}
          />
        </div>
        <div className="animate-fade-in-up delay-300 flex gap-3 pt-4">
          <Link
            href="/about"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent/25"
          >
            About me
          </Link>
          <a
            href="https://github.com/SMkim94"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-all hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Section cards */}
      <section>
        <ScrollFadeIn>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-muted">
            Explore
          </h2>
        </ScrollFadeIn>
        <div className="grid gap-4 sm:grid-cols-3">
          {sections.map((section, i) => (
            <ScrollFadeIn key={section.href} delay={i * 100}>
              <Link
                href={section.href}
                className="card-glow group flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
              >
                <span className="text-2xl">{section.icon}</span>
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted">{section.description}</p>
              </Link>
            </ScrollFadeIn>
          ))}
        </div>
      </section>

      {/* Recent projects */}
      {projects.length > 0 && (
        <section>
          <ScrollFadeIn>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
                Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                View all &rarr;
              </Link>
            </div>
          </ScrollFadeIn>
          <div className="grid gap-4">
            {projects.slice(0, 3).map((project, i) => (
              <ScrollFadeIn key={project.title} delay={i * 100}>
                <div className="card-glow rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag rounded-full border border-border px-2.5 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Recent blog posts */}
      {recentPosts.length > 0 && (
        <section>
          <ScrollFadeIn>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
                Recent Posts
              </h2>
              <Link
                href="/blog"
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                View all &rarr;
              </Link>
            </div>
          </ScrollFadeIn>
          <div className="flex flex-col gap-4">
            {recentPosts.map((post, i) => (
              <ScrollFadeIn key={post.slug} delay={i * 100}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-glow group block rounded-xl border border-border bg-card p-6"
                >
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="mt-1 text-sm text-muted">{post.summary}</p>
                  )}
                  <time className="mt-2 block text-xs text-muted">
                    {post.date}
                  </time>
                </Link>
              </ScrollFadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
