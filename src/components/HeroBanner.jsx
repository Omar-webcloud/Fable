"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-24 text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-4 text-center"
      >
        <motion.h1 variants={itemVariants} className="mb-6 text-4xl font-bold md:text-6xl">
          Discover &amp; Read Original Ebooks
        </motion.h1>
        <motion.p variants={itemVariants} className="mb-8 text-lg text-purple-100 md:text-xl">
          Explore stories from talented writers around the world.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/browse"
            className="inline-block rounded-xl bg-accent px-8 py-3 font-semibold text-dark transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
          >
            Browse Ebooks
          </Link>
        </motion.div>
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
