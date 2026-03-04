import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          안녕하세요 👋
        </h1>
        <p className="mt-4 text-lg text-muted">
          개발을 좋아하는 SM입니다.
          <br />
          이것저것 만들고, 기록하는 공간입니다.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/about"
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-card"
        >
          About me &rarr;
        </Link>
        <Link
          href="/projects"
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-card"
        >
          Projects &rarr;
        </Link>
        <Link
          href="/blog"
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-card"
        >
          Blog &rarr;
        </Link>
      </div>
    </div>
  );
}
