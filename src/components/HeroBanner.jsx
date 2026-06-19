"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-24 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-7xl px-4 text-center"
      >
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">
          Discover &amp; Read Original Ebooks
        </h1>
        <p className="mb-8 text-lg text-purple-100 md:text-xl">
          Explore stories from talented writers around the world.
        </p>
        <Link
          href="/browse"
          className="inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-dark transition hover:bg-yellow-400"
        >
          Browse Ebooks
        </Link>
      </motion.div>

      <motion.div
        className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  );
}
