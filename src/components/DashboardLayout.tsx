"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen flex-col p-4 gap-4">
      {/* Top bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="gradient-text text-xl font-bold">
            SM
          </Link>
          <span className="text-border">/</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <nav className="flex gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-card font-medium text-foreground"
                  : "text-muted hover:bg-card hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Content */}
      <div className="panel flex-1 min-h-0 overflow-hidden">
        <div className="panel-scroll h-full p-8">{children}</div>
      </div>
    </div>
  );
}
