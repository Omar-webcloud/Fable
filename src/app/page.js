"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import { ebookService, writerService } from "@/services";
import { GENRES } from "@/constants";
import { getInitials } from "@/utils";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingWriters, setLoadingWriters] = useState(true);

  useEffect(() => {
    ebookService.getFeatured()
      .then((res) => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoadingBooks(false));

    writerService.getTop()
      .then((res) => setWriters(res.data))
      .catch(() => {})
      .finally(() => setLoadingWriters(false));
  }, []);

  return (
    <>
      <HeroBanner />

      {/* Featured Ebooks */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-3xl font-bold text-dark"
        >
          Featured Ebooks
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingBooks
            ? Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
            : featured.length > 0
              ? featured.map((ebook, i) => (
                  <EbookCard key={ebook._id} ebook={ebook} index={i} />
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
                      <svg className="h-16 w-16 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-dark">Sample Ebook {i + 1}</h3>
                      <p className="text-sm text-gray-500">Add ebooks to see them here</p>
                      <div className="mt-3">
                        <Link href="/browse" className="text-sm text-secondary hover:underline">Browse →</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
        </div>
      </section>

      {/* Top Writers */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-3xl font-bold text-dark"
          >
            Top Writers
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {loadingWriters
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-background p-6 text-center">
                    <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-200" />
                    <div className="mx-auto mb-2 h-5 w-24 rounded bg-gray-200" />
                    <div className="mx-auto h-4 w-16 rounded bg-gray-200" />
                  </div>
                ))
              : (writers.length > 0 ? writers.slice(0, 3) : [
                  { name: "Become a Writer", totalSales: 0 },
                  { name: "Share Your Story", totalSales: 0 },
                  { name: "Join Fable", totalSales: 0 },
                ]).map((writer, i) => (
                  <motion.div
                    key={writer.writerId || i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-gray-100 bg-background p-6 text-center shadow-sm transition hover:shadow-md"
                  >
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-lg">
                      {writer.image ? (
                        <img src={writer.image} alt={writer.name} className="h-full w-full object-cover" />
                      ) : (
                        getInitials(writer.name)
                      )}
                    </div>
                    <h3 className="font-semibold text-dark">{writer.name}</h3>
                    <p className="text-sm text-gray-500">{writer.totalSales} sales</p>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Ebook Genres */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-3xl font-bold text-dark"
        >
          Ebook Genres
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GENRES.map((genre, i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/browse?genre=${genre.toLowerCase()}`}
                className="block rounded-xl bg-white p-6 text-center font-semibold text-dark shadow-sm transition-all hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-lg"
              >
                {genre}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
