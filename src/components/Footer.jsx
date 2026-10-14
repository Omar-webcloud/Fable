import Link from "next/link";
import { BookOpen } from "lucide-react";
import { GENRES } from "@/constants";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 border-t border-zinc-700/30 text-white mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 transition-colors group-hover:border-amber-500/50">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xl font-medium tracking-tight text-white">Fable</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Discover and read original ebooks from talented writers around the world. Autonomous digital publishing for the modern era.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-zinc-700/60 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                aria-label="X"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-zinc-700/60 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center border border-zinc-700/60 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-zinc-400 transition-colors hover:text-white">
                  Browse Ebooks
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 transition-colors hover:text-white">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 transition-colors hover:text-white">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Popular Genres
            </h4>
            <ul className="space-y-2.5 text-sm">
              {GENRES.slice(0, 5).map((genre) => (
                <li key={genre}>
                  <Link
                    href={`/browse?genre=${genre.toLowerCase()}`}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Stay Updated */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Newsletter
            </h4>
            <p className="mb-3 text-sm text-zinc-400 leading-relaxed">
              Subscribe to get curated book releases and author spotlights directly in your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="reader@fable.com"
                className="w-full border border-zinc-700 bg-zinc-800/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-500"
              />
              <button
                type="button"
                className="w-full bg-white py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-950 transition-colors hover:bg-zinc-200 active:scale-95 cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/80 pt-8 sm:flex-row text-xs text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} Fable Platform Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
