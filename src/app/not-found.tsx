import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <h1 className="gradient-text text-6xl font-bold">404</h1>
      <p className="text-muted">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent/25"
      >
        홈으로 &rarr;
      </Link>
    </div>
  );
}
