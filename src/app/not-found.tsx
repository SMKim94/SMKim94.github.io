import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="gradient-text text-6xl font-bold">404</h1>
        <p className="mt-3 text-muted">페이지를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          홈으로 &rarr;
        </Link>
      </div>
    </div>
  );
}
