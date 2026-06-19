import HeroBanner from "@/components/HeroBanner";
import { GENRES } from "@/constants";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold text-dark">Featured Ebooks</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                Cover
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-dark">Ebook Title</h3>
                <p className="text-sm text-gray-500">Writer Name</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">$9.99</span>
                  <Link
                    href="/browse"
                    className="text-sm text-secondary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-3xl font-bold text-dark">Top Writers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-background p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                  W
                </div>
                <h3 className="font-semibold text-dark">Writer Name</h3>
                <p className="text-sm text-gray-500">120 sales</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-3xl font-bold text-dark">Ebook Genres</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GENRES.map((genre) => (
            <Link
              key={genre}
              href={`/browse?genre=${genre.toLowerCase()}`}
              className="rounded-xl bg-white p-6 text-center font-semibold text-dark shadow-sm transition hover:bg-primary hover:text-white"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
