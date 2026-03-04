import type { Metadata } from "next";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <DashboardLayout title="Blog">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Blog</span>
        </h1>

        {posts.length === 0 ? (
          <p className="text-muted">아직 글이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-border p-5 transition-all hover:border-accent hover:bg-accent/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-semibold group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <time className="shrink-0 text-xs text-muted">
                    {post.date}
                  </time>
                </div>
                {post.summary && (
                  <p className="mt-1 text-sm text-muted">{post.summary}</p>
                )}
                {post.tags.length > 0 && (
                  <div className="mt-2 flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background px-2 py-0.5 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
