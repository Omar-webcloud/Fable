"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";
import { ebookService } from "@/services";
import { GENRES, SORT_OPTIONS } from "@/constants";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";

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
      if (availability === "free") {
        params.maxPrice = 0;
      } else if (availability) {
        params.availability = availability;
      }

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

  const hasActiveFilters = Boolean(search || genre || minPrice || maxPrice || availability || sort !== "newest");

  const clearFilters = () => {
    setSearch("");
    setGenre("");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("");
    setSort("newest");
  };

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <SectionBadge>Curated Catalog</SectionBadge>
          <BlurHeading
            text="Explore the Fable Library"
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
          />
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Search thousands of original publications by independent writers. Filter by genre, pricing, and availability.
          </p>
        </div>

        {/* Technical Filter Box */}
        <div className="mb-10 border border-zinc-700/40 bg-zinc-900/80 p-6 backdrop-blur-md space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                placeholder="Search by title, writer, or synopsis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-amber-500"
              />
            </div>

            {/* Selects */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500 cursor-pointer"
              >
                <option value="">All Genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g.toLowerCase()}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500 cursor-pointer"
              >
                <option value="">All Tiers</option>
                <option value="free">Free to Read (No Paywall)</option>
                <option value="in_stock">Available Now</option>
                <option value="sold">Sold Out</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-amber-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Row: Price & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono uppercase tracking-wider text-zinc-400">Price Range:</span>
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-20 border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-500"
                min="0"
              />
              <span className="text-zinc-600">—</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-20 border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-500"
                min="0"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {loading ? "Searching catalog..." : `${pagination.total} Titles Available`}
          </p>
        </div>

        {/* Ebook Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <EbookCardSkeleton key={i} />)
            : ebooks.map((ebook, i) => (
                <EbookCard key={ebook._id} ebook={ebook} index={i} />
              ))}
        </div>

        {/* Empty State */}
        {!loading && ebooks.length === 0 && (
          <div className="border border-zinc-700/30 bg-zinc-900/40 py-24 text-center px-6">
            <div className="flex h-16 w-16 mx-auto items-center justify-center border border-zinc-700 bg-zinc-800 text-zinc-500 mb-4">
              <BookOpen className="h-8 w-8 stroke-[1.2]" />
            </div>
            <h3 className="text-lg font-medium text-white">No Ebooks Match Your Criteria</h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-sm mx-auto">
              We couldn&apos;t find any stories matching your search or filters. Try adjusting price limits or clearing genres.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 bg-white px-6 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Technical Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex h-10 items-center gap-1 border border-zinc-700 bg-zinc-900/60 px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border text-xs font-mono transition-colors cursor-pointer",
                  p === page
                    ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold"
                    : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
                )}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="flex h-10 items-center gap-1 border border-zinc-700 bg-zinc-900/60 px-4 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
