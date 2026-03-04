import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    return { title: meta.title };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  try {
    const { meta, content } = getPostBySlug(slug);

    return (
      <DashboardLayout title={meta.title}>
        <article className="mx-auto max-w-2xl flex flex-col gap-6">
          <header>
            <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted">
              <time>{meta.date}</time>
              {meta.tags.length > 0 && (
                <div className="flex gap-1.5">
                  {meta.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-background px-2 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          <div className="prose prose-neutral max-w-none">
            <MDXRemote source={content} />
          </div>
        </article>
      </DashboardLayout>
    );
  } catch {
    notFound();
  }
}
