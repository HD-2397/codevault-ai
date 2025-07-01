/** @format */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-gray-700 bg-gray-900 px-6 py-4 shadow-sm text-white dark:bg-black dark:border-gray-800">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold text-white hover:text-gray-300"
        >
          🧠 CodeVault AI
        </Link>

        <nav className="flex space-x-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium hover:text-gray-300",
              pathname === "/" ? "text-white" : "text-gray-400"
            )}
          >
            Upload
          </Link>
          <Link
            href="/query"
            className={cn(
              "text-sm font-medium hover:text-gray-300",
              pathname === "/query" ? "text-white" : "text-gray-400"
            )}
          >
            Ask a question
          </Link>
        </nav>
      </div>
    </header>
  );
}
