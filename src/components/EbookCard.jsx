"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, BookOpen } from "lucide-react";
import { formatPrice } from "@/utils";
import { useWishlist } from "@/providers/WishlistProvider";
import { cn } from "@/lib/utils";

export default function EbookCard({ ebook, index = 0, purchased = false }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(ebook._id);
  const ebookIsFree = Boolean(ebook?.isFree || Number(ebook?.price) === 0);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(ebook._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full group"
    >
      <Link href={`/ebooks/${ebook._id}`} className="block h-full">
        <div className="flex h-full flex-col border border-zinc-700/30 bg-zinc-900/60 hover:bg-zinc-800/50 hover:border-zinc-500/50 transition-all duration-300 shadow-sm relative overflow-hidden">
          {/* Cover Media Container */}
          <div className="relative h-60 w-full overflow-hidden bg-zinc-950 border-b border-zinc-700/30">
            {/* Wishlist Toggle Button */}
            <button
              type="button"
              onClick={handleWishlistClick}
              className={cn(
                "absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center border transition-all duration-200 cursor-pointer backdrop-blur-md",
                wishlisted
                  ? "border-red-500/60 bg-red-950/80 text-red-400"
                  : "border-zinc-700/60 bg-zinc-900/80 text-zinc-400 hover:border-zinc-500 hover:text-white"
              )}
              aria-label="Toggle Wishlist"
            >
              <Heart
                className={cn("h-4 w-4", wishlisted && "fill-red-500 text-red-500")}
              />
            </button>

            {/* Purchased or Free Badge */}
            {ebookIsFree ? (
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 border border-emerald-500/50 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                <div className="h-1.5 w-1.5 bg-emerald-400" />
                <span>Free Read</span>
              </div>
            ) : purchased ? (
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 border border-amber-500/40 bg-zinc-900/90 px-2.5 py-1 text-[11px] font-medium text-amber-400 backdrop-blur-md">
                <div className="h-1.5 w-1.5 bg-amber-500" />
                <span>Purchased</span>
              </div>
            ) : null}

            {/* Image / Fallback */}
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 p-6 text-zinc-600">
                <BookOpen className="h-12 w-12 text-zinc-700 mb-2 stroke-[1.2]" />
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-mono">Fable Original</span>
              </div>
            )}

            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Card Body */}
          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  {ebook.genre || "General"}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium font-mono",
                    ebookIsFree ? "text-emerald-400 font-bold" : "text-amber-500"
                  )}
                >
                  {ebookIsFree ? "FREE" : formatPrice(ebook.price)}
                </span>
              </div>

              <h3 className="font-normal text-lg tracking-tight text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                {ebook.title}
              </h3>

              <p className="text-xs text-zinc-400">
                By <span className="text-zinc-300 font-medium">{ebook.writerName || "Independent Author"}</span>
              </p>
            </div>

            {/* Footer metadata */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
              <span className="group-hover:text-zinc-300 transition-colors flex items-center gap-1">
                View Details &rarr;
              </span>
              <span className="font-mono text-[11px] text-zinc-500">
                {ebook.salesCount ? `${ebook.salesCount} sold` : "Instant Access"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
