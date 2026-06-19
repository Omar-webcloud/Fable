"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/utils";

export default function EbookCard({ ebook, index = 0, purchased = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/ebooks/${ebook._id}`} className="group block">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-purple-50 to-violet-100">
            {ebook.coverImage ? (
              <img
                src={ebook.coverImage}
                alt={ebook.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-16 w-16 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            )}
            {purchased && (
              <span className="absolute right-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                Purchased
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="p-4">
            <h3 className="line-clamp-1 font-semibold text-dark transition-colors group-hover:text-primary">
              {ebook.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{ebook.writerName}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                {formatPrice(ebook.price)}
              </span>
              {ebook.genre && (
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-primary">
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
