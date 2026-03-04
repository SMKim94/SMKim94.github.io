import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted">아직 글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border border-border p-5 transition-colors hover:bg-card"
            >
              <h2 className="font-semibold group-hover:text-accent">
                {post.title}
              </h2>
              {post.summary && (
                <p className="mt-1 text-sm text-muted">{post.summary}</p>
              )}
              <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                <time>{post.date}</time>
                {post.tags.length > 0 && (
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-card px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
