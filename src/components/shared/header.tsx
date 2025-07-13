/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 border-border backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-foreground hover:opacity-80 transition-colors"
        >
          🧠 CodeVault AI
        </Link>

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
