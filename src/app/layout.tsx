/** @format */

// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeVault AI",
  description: "Your AI Pair Programmer & Codebase Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark`}>
        <Header />
        <main className="min-h-[80vh] max-w-5xl mx-auto px-4 py-8">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
