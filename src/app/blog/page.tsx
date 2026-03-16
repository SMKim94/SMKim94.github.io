import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        Blog
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        생각과 경험을 기록합니다.
      </p>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-xl border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          아직 작성된 글이 없습니다.
        </div>
      ) : (
        <div className="mt-10 divide-y divide-zinc-200 dark:divide-zinc-800">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block py-6 first:pt-0"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h2 className="text-lg font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                <time className="shrink-0 text-sm text-zinc-500 dark:text-zinc-500">
                  {post.date}
                </time>
              </div>
              {post.summary && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {post.summary}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
  );
}
