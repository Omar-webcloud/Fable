import Link from "next/link";
import { GENRES, SORT_OPTIONS } from "@/constants";

export default async function BrowsePage({ searchParams }) {
  const params = await searchParams;
  const genre = params?.genre || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-dark">Browse Ebooks</h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <input
          type="search"
          placeholder="Search by title or writer..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary"
        />
        <select
          defaultValue={genre}
          className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary"
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g.toLowerCase()}>
              {g}
            </option>
          ))}
        </select>
        <select className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-primary">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
              Cover
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-dark">Ebook Title</h3>
              <p className="text-sm text-gray-500">Writer Name</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-primary">$9.99</span>
                <Link href="/ebooks/1" className="text-sm text-secondary hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
