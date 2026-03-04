import Link from "next/link";
import TypingText from "@/components/TypingText";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/data/projects";

const navLinks = [
  { href: "/about", label: "About", icon: "👤" },
  { href: "/projects", label: "Projects", icon: "🛠" },
  { href: "/blog", label: "Blog", icon: "✍️" },
];

const skills = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "HTML/CSS"];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 4);

  return (
    <div className="flex h-screen flex-col p-4 gap-4">
      {/* Top bar */}
      <header className="animate-in flex items-center justify-between">
        <h1 className="gradient-text text-xl font-bold">SM</h1>
        <nav className="flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/SMkim94"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Dashboard grid */}
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-4 min-h-0">
        {/* Profile panel */}
        <div className="panel animate-in delay-1 flex flex-col justify-center p-8 row-span-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Welcome
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            안녕하세요,
            <br />
            <span className="gradient-text">SM</span>입니다.
          </h2>
          <div className="mt-3 h-6 text-sm text-muted">
            <TypingText
              texts={[
                "코드를 작성합니다",
                "문제를 해결합니다",
                "새로운 것을 만듭니다",
              ]}
            />
          </div>
          <div className="mt-6 flex gap-2">
            <Link
              href="/about"
              className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
            >
              About me &rarr;
            </Link>
          </div>
        </div>

        {/* Skills panel */}
        <div className="panel animate-in delay-2 flex flex-col p-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
            Skills
          </h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="tag rounded-full border border-border px-3 py-1.5 text-sm text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Blog panel */}
        <div className="panel animate-in delay-3 flex flex-col p-6 row-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
              Recent Posts
            </h3>
            <Link
              href="/blog"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="panel-scroll mt-4 flex flex-1 flex-col gap-3 min-h-0">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted">아직 글이 없습니다.</p>
            ) : (
              recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border border-border p-4 transition-all hover:border-accent hover:bg-accent/5"
                >
                  <h4 className="text-sm font-semibold group-hover:text-accent transition-colors">
                    {post.title}
                  </h4>
                  {post.summary && (
                    <p className="mt-1 text-xs text-muted line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                  <time className="mt-2 block text-[11px] text-muted/70">
                    {post.date}
                  </time>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Projects panel */}
        <div className="panel animate-in delay-4 col-span-2 flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">
              Projects
            </h3>
            <Link
              href="/projects"
              className="text-xs text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="panel-scroll mt-4 grid flex-1 grid-cols-2 gap-3 min-h-0">
            {projects.map((project) => (
              <div
                key={project.title}
                className="flex flex-col rounded-xl border border-border p-4 transition-all hover:border-accent hover:bg-accent/5"
              >
                <h4 className="text-sm font-semibold">{project.title}</h4>
                <p className="mt-1 flex-1 text-xs text-muted line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-background px-2 py-0.5 text-[11px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs text-accent hover:underline"
                  >
                    GitHub &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
