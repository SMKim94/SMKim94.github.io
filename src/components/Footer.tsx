export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-8 text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} SM</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/SMkim94"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
