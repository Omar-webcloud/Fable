"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils";
import { useWishlist } from "@/providers/WishlistProvider";

export default function EbookCard({ ebook, index = 0, purchased = false }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(ebook._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(ebook._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Link href={`/ebooks/${ebook._id}`} className="group block h-full">
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-shadow duration-300 hover:shadow-lg h-full flex flex-col">
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100 dark:from-slate-800 dark:to-slate-950 shrink-0">
            {/* Wishlist Heart Toggle */}
            <button
              type="button"
              onClick={handleWishlistClick}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 text-gray-500 dark:text-gray-400 backdrop-blur-sm transition hover:bg-white hover:text-red-500 dark:bg-slate-950/80 dark:hover:bg-slate-900 dark:hover:text-red-500 shadow-sm"
              aria-label="Toggle Wishlist"
            >
              <svg className="h-5 w-5" fill={wishlisted ? "#EF4444" : "none"} stroke={wishlisted ? "#EF4444" : "currentColor"} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>

            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-16 w-16 text-purple-200 dark:text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            )}
            {purchased && (
              <span className="absolute left-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                Purchased
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="line-clamp-1 font-semibold text-dark dark:text-white transition-colors group-hover:text-primary dark:group-hover:text-purple-400">
                {ebook.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{ebook.writerName}</p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-primary dark:text-purple-400">
                {formatPrice(ebook.price)}
              </span>
              {ebook.genre && (
                <span className="rounded-full bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 text-xs font-medium text-primary dark:text-purple-300">
                  {ebook.genre}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
