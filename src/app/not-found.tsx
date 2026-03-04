import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-4 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-card"
      >
        홈으로 &rarr;
      </Link>
    </div>
  );
}
