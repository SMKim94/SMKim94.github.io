import type { Metadata } from "next";
import Link from "next/link";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <div className="animate-fade-in-up">
          <p className="text-sm font-medium uppercase tracking-widest text-muted">Writing</p>
        </div>
        <h1 className="animate-fade-in-up delay-100 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="gradient-text">Blog</span>
        </h1>
      </section>

      {posts.length === 0 ? (
        <p className="text-muted">아직 글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post, i) => (
            <ScrollFadeIn key={post.slug} delay={i * 100}>
              <Link
                href={`/blog/${post.slug}`}
                className="card-glow group rounded-xl border border-border bg-card p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="mt-1 text-sm text-muted">{post.summary}</p>
                    )}
                  </div>
                  <time className="shrink-0 text-xs text-muted">{post.date}</time>
                </div>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tag rounded-full border border-border px-2 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </ScrollFadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
