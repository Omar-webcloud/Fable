import Link from "next/link";
import { GENRES } from "@/constants";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-dark text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-xl font-bold text-secondary">Fable</h3>
          <p className="text-sm text-gray-400">
            Discover and read original ebooks from talented writers.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Genres</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {GENRES.slice(0, 4).map((genre) => (
              <li key={genre}>
                <Link href={`/browse?genre=${genre.toLowerCase()}`} className="hover:text-white">
                  {genre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold">Newsletter</h4>
          <p className="mb-3 text-sm text-gray-400">Stay updated with new releases.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-lg bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm transition hover:bg-secondary">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Fable. All rights reserved.
      </div>
    </footer>
  );
}
