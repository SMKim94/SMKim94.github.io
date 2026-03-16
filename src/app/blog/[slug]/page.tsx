import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.meta.title };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/blog"
        className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        &larr; Back to blog
      </Link>

      <article className="mt-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {post.meta.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <time className="text-sm text-zinc-500 dark:text-zinc-500">
              {post.meta.date}
            </time>
            {post.meta.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.meta.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
