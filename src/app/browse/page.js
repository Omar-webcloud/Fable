"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton, SkeletonLoader } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ebookService } from "@/services";
import { GENRES, SORT_OPTIONS } from "@/constants";
import { useDebounce } from "@/hooks";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [availability, setAvailability] = useState(searchParams.get("availability") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (debouncedSearch) params.search = debouncedSearch;
      if (genre) params.genre = genre;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (availability) params.availability = availability;

      const res = await ebookService.getAll(params);
      setEbooks(res.data.ebooks || []);
      setPagination(res.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, genre, sort, minPrice, maxPrice, page, availability]);

  useEffect(() => {
    fetchEbooks();
  }, [fetchEbooks]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, genre, sort, minPrice, maxPrice, availability]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-dark dark:text-white">Browse Ebooks</h1>

      {/* Filters */}
      <div className="mb-8 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="search"
              placeholder="Search by title or writer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-slate-950 text-dark dark:text-white"
            />
          </div>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 outline-none focus:border-primary bg-white dark:bg-slate-950 text-dark dark:text-white"
          >
            <option value="">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 outline-none focus:border-primary bg-white dark:bg-slate-950 text-dark dark:text-white"
          >
            <option value="">All Availability</option>
            <option value="in_stock">In Stock</option>
            <option value="sold">Sold</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 outline-none focus:border-primary bg-white dark:bg-slate-950 text-dark dark:text-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400">Price:</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 rounded-lg border border-gray-300 dark:border-slate-800 px-3 py-1.5 text-sm outline-none focus:border-primary bg-white dark:bg-slate-950 text-dark dark:text-white"
            min="0"
          />
          <span className="text-gray-400 dark:text-slate-500">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 rounded-lg border border-gray-300 dark:border-slate-800 px-3 py-1.5 text-sm outline-none focus:border-primary bg-white dark:bg-slate-950 text-dark dark:text-white"
            min="0"
          />
          {(search || genre || minPrice || maxPrice || availability || sort !== "newest") && (
            <button
              onClick={() => { setSearch(""); setGenre(""); setMinPrice(""); setMaxPrice(""); setAvailability(""); setSort("newest"); }}
              className="ml-auto text-sm text-primary dark:text-purple-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
          {pagination.total} ebook{pagination.total !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Ebook Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <EbookCardSkeleton key={i} />)
          : ebooks.map((ebook, i) => (
              <EbookCard key={ebook._id} ebook={ebook} index={i} />
            ))}
      </div>

      {/* Empty state */}
      {!loading && ebooks.length === 0 && (
        <div className="py-20 text-center">
          <svg className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <h3 className="text-lg font-semibold text-dark dark:text-white">No ebooks found</h3>
          <p className="mt-1 text-gray-500 dark:text-slate-400">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-primary text-white shadow-md"
                  : "border border-gray-300 dark:border-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
