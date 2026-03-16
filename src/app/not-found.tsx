import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="text-center">
        <h1 className="gradient-text text-7xl font-bold">404</h1>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          페이지를 찾을 수 없습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          홈으로 &rarr;
        </Link>
      </div>
    </div>
  );
}
