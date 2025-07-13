/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 border-border backdrop-blur-md px-6 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Branding */}
        <Link
          href="/"
          className="text-lg font-semibold text-foreground tracking-tight hover:opacity-80 transition-colors"
        >
          CodeVault AI
          <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">
            Context-Aware Codebase Chat
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex space-x-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-80",
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            Upload
          </Link>
          <Link
            href="/query"
            className={cn(
              "text-sm font-medium transition-colors hover:opacity-80",
              pathname === "/query"
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            Ask a question
          </Link>
        </nav>
      </div>
    </header>
  );
}
