import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-10 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} SM. All rights reserved.</p>
        <div className="flex gap-4">
          <Link
            href="https://github.com/SMKim94"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
