import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="animate-gradient rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[1px]">
          <div className="rounded-2xl bg-white px-8 py-16 dark:bg-zinc-950 sm:px-12 sm:py-20">
            <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
              Welcome
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
              안녕하세요,{" "}
              <span className="gradient-text">SM</span>입니다.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              소프트웨어 개발자로서 웹 기술과 다양한 프로젝트에 관심을 가지고 있습니다.
              이곳에서 저의 작업물과 생각을 공유합니다.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/about"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                About Me
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts teaser */}
      <section className="pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          블로그 글을 작성해보세요! <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">content/posts/</code> 폴더에 MDX 파일을 추가하면 됩니다.
        </div>
      </section>
    </div>
  );
}
