// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link"; // ✅ Import Next.js Link
import "./globals.css";

export const metadata: Metadata = {
  title: "World Wonders",
  description: "Explore World Wonders Travel and Tours",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Header with Next.js Link instead of <a> */}
        <header className="p-4 bg-white shadow-md flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            World Wonders
          </Link>

          <nav className="space-x-4">
            <Link href="/visa">Visa</Link>
            <Link href="/packages">Packages</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        {/* ✅ Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* ✅ Footer with example external + internal links */}
        <footer className="p-4 bg-gray-100 text-center">
          <p>© {new Date().getFullYear()} World Wonders Travel and Tours</p>
          <div className="mt-2 space-x-4">
            {/* Internal link → use Link */}
            <Link href="/privacy">Privacy Policy</Link>
            {/* External link → keep <a> */}
            <a
              href="https://facebook.com/worldwonders"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
