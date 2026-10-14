"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Feather } from "lucide-react";

export default function HeroBanner() {
  const headline = "Discover & Read Original Ebooks";

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden border-b border-zinc-700/30">
      {/* Background Hero Image from Skydda */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />

      {/* Dark tint overlay for technical legibility */}
      <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-[1px]" />

      {/* Grain / texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" result=\"noise\" /></filter><rect width=\"100\" height=\"100\" filter=\"url(%23noise)\" fill=\"%23ffffff\"/></svg>')",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-28 lg:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Heading with word-by-word blur-in animation from Skydda */}
          <h1 className="text-balance text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08]">
            {headline.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-10 sm:w-auto sm:flex-row"
          >
            <Link
              href="/browse"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-lg shadow-black/40"
            >
              <span>Browse Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-900/60 backdrop-blur-md px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-zinc-800/80 hover:border-zinc-500 active:scale-95 cursor-pointer"
            >
              <Feather className="h-4 w-4 text-amber-500" />
              <span>Publish as Writer</span>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-6 border-t border-zinc-800/80 pt-8 text-center sm:mt-16 sm:grid-cols-3 sm:gap-12 sm:pt-10"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-normal text-white font-mono">100%</div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1 font-mono">Author Payouts</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-normal text-white font-mono">0-Sec</div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1 font-mono">Instant Delivery</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-2xl sm:text-3xl font-normal text-amber-500 font-mono">Zero</div>
              <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1 font-mono">Platform Lock-in</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
