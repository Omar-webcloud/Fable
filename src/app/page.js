"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import { SectionHeader, SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";
import { LogoCloud } from "@/components/ui/LogoCloud";
import { ebookService, writerService } from "@/services";
import { GENRES } from "@/constants";
import { BookOpen, Sparkles, Feather, ArrowRight, ChevronRight, User, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const platformFeatures = [
  {
    id: 1,
    title: "1 — Discover Independent Voices",
    description:
      "Explore stories free from traditional gatekeeping. Direct access to unedited, raw, and imaginative literary creations.",
    icon: <BookOpen className="w-5 h-5" />,
    image: "/images/solution-learn.png",
  },
  {
    id: 2,
    title: "2 — Fair 100% Direct Payouts",
    description:
      "Writers retain maximum revenue without corporate cuts. Automated Stripe payment infrastructure protects every sale.",
    icon: <ShieldCheck className="w-5 h-5" />,
    image: "/images/solution-detect.png",
  },
  {
    id: 3,
    title: "3 — Instant Digital Library",
    description:
      "Instant reader access across all your devices. Zero clutter, lifetime access, and high-performance digital typography.",
    icon: <Sparkles className="w-5 h-5" />,
    image: "/images/solution-neutralize.png",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingWriters, setLoadingWriters] = useState(true);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    ebookService
      .getFeatured()
      .then((res) => setFeatured(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingBooks(false));

    writerService
      .getTop()
      .then((res) => setWriters(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingWriters(false));
  }, []);

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Logo & Trust Cloud from Skydda */}
      <section className="relative w-full bg-zinc-900 py-16 md:py-20 border-b border-zinc-700/30">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <LogoCloud />
        </div>
      </section>

      {/* 3. Problem Section (Adapted from Skydda's ProblemSection) */}
      <section className="relative w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30">
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 md:px-12 lg:px-16">
          <div className="space-y-8 text-center flex flex-col items-center max-w-3xl">
            <SectionBadge>The Publishing Paradigm</SectionBadge>
            
            <BlurHeading
              text="Traditional Publishing Was Built for a Static Era"
              className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1]"
            />

            <p className="text-balance text-base sm:text-lg leading-relaxed text-zinc-400">
              For decades, corporate gatekeepers collected up to 70% of book royalties while authors waited months for payments. Today, digital storytelling lives in direct connection with audiences. Authors deserve immediate distribution, clear analytics, and 100% fair payout speed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 shadow-md"
              >
                Start Publishing
              </Link>
              <Link
                href="/browse"
                className="border border-zinc-700 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-95"
              >
                Explore Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Ebooks Section (Skydda Features Layout) */}
      <section className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <SectionBadge>Featured Releases</SectionBadge>
              <BlurHeading
                text="Original Handpicked Titles"
                className="text-3xl sm:text-4xl md:text-5xl font-normal"
              />
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Explore the latest publications and top-selling originals directly supported by our reader community.
              </p>
            </div>

            <Link
              href="/browse"
              className="flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors shrink-0"
            >
              <span>View Full Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loadingBooks
              ? Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
              : featured.length > 0
              ? featured.map((ebook, i) => (
                  <EbookCard key={ebook._id} ebook={ebook} index={i} />
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-zinc-700/30 bg-zinc-900/40 p-6 flex flex-col justify-between"
                  >
                    <div className="flex h-48 items-center justify-center bg-zinc-950 border border-zinc-800">
                      <BookOpen className="h-12 w-12 text-zinc-700 stroke-[1.2]" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <span className="text-xs uppercase font-mono text-amber-500">Sample Title</span>
                      <h4 className="text-lg font-medium text-white">Original Story {i + 1}</h4>
                      <p className="text-xs text-zinc-400">Discover fresh indie releases in the catalog.</p>
                      <div className="pt-2">
                        <Link href="/browse" className="text-xs text-zinc-300 hover:text-white flex items-center gap-1">
                          Explore Library &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Solution Showcase (Adapted from Skydda's SolutionSection) */}
      <section className="w-full bg-zinc-900 text-white py-24 md:py-32 flex flex-col items-center overflow-hidden border-b border-zinc-700/30">
        <div className="max-w-7xl w-full px-6 md:px-12 lg:px-16 space-y-12">
          {/* Header */}
          <div className="flex flex-col gap-4 max-w-[560px]">
            <SectionBadge>Platform Architecture</SectionBadge>
            <BlurHeading
              text="Engineered for Authors and Readers"
              className="text-4xl md:text-5xl font-normal leading-[1.1]"
            />
            <p className="text-zinc-400 text-base leading-relaxed">
              Fable eliminates intermediaries. An autonomous distribution engine that protects creative copyright while delivering seamless reader experiences worldwide.
            </p>
          </div>

          {/* Interactive Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
            {/* Left Image View */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-800 border border-zinc-700/40 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatureIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={platformFeatures[activeFeatureIndex].image}
                    alt={platformFeatures[activeFeatureIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Progress Ticker */}
              <div className="absolute bottom-4 left-4 right-4 h-1 flex gap-2">
                {platformFeatures.map((_, idx) => (
                  <div key={idx} className="h-full flex-1 bg-white/10 overflow-hidden">
                    {activeFeatureIndex === idx && (
                      <motion.div
                        className="h-full bg-amber-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                      />
                    )}
                    {idx < activeFeatureIndex && <div className="h-full w-full bg-amber-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Feature List */}
            <div className="flex flex-col gap-4">
              {platformFeatures.map((feat, index) => (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeatureIndex(index)}
                  className={cn(
                    "group relative w-full text-left p-6 transition-all duration-300 outline-none cursor-pointer",
                    activeFeatureIndex === index
                      ? "bg-zinc-800/80 border border-zinc-700 shadow-sm"
                      : "bg-transparent border border-transparent hover:bg-zinc-800/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "mt-1 p-2 transition-colors duration-300",
                        activeFeatureIndex === index
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-zinc-800 text-zinc-400"
                      )}
                    >
                      {feat.icon}
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3
                        className={cn(
                          "text-xl font-medium transition-colors duration-300",
                          activeFeatureIndex === index ? "text-white" : "text-zinc-400"
                        )}
                      >
                        {feat.title}
                      </h3>

                      <AnimatePresence>
                        {activeFeatureIndex === index && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-zinc-400 text-sm leading-relaxed overflow-hidden pt-1"
                          >
                            {feat.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        activeFeatureIndex === index ? "text-amber-500 translate-x-1" : "text-zinc-600"
                      )}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Top Writers / Author Spotlight (Skydda Testimonials Grid) */}
      <section className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <div className="space-y-4 mb-16">
            <SectionBadge>Author Spotlight</SectionBadge>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <BlurHeading
                text="Top Independent Authors on Fable"
                className="text-3xl sm:text-4xl md:text-5xl font-normal"
              />
              <span className="text-zinc-400 text-sm">
                Ranked by reader community engagement &amp; total sales
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-zinc-700/30 bg-zinc-950/40">
            {loadingWriters
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-8 border-b md:border-b-0 md:border-r border-zinc-700/30 animate-pulse space-y-4">
                    <div className="w-12 h-12 bg-zinc-800" />
                    <div className="h-4 bg-zinc-800 w-3/4" />
                    <div className="h-3 bg-zinc-800 w-1/2" />
                  </div>
                ))
              : (writers.length > 0
                  ? writers.slice(0, 3)
                  : [
                      { name: "Eleanor Vance", totalSales: 1420, bio: "Speculative fiction author exploring machine sentience and lost worlds." },
                      { name: "Julian Hayes", totalSales: 980, bio: "Thriller and cybersecurity suspense writer with over 5 published originals." },
                      { name: "Dr. Maya Thorne", totalSales: 750, bio: "Biotech researcher and author of high-concept near-future science fiction." },
                    ]
                ).map((writer, index) => (
                  <div
                    key={writer.writerId || index}
                    className={cn(
                      "p-8 border-zinc-700/30 flex flex-col justify-between space-y-6",
                      index !== 2 && "border-b md:border-b-0 md:border-r"
                    )}
                  >
                    <div className="space-y-4">
                      <div className="text-amber-500 font-mono text-3xl font-light">"</div>
                      <p className="text-zinc-300 text-sm leading-relaxed min-h-[70px]">
                        {writer.bio || "Fable gives me complete creative autonomy and sends payments straight to my account. No middleman, no bureaucracy."}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                      <div className="flex h-11 w-11 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 font-semibold text-base">
                        {writer.name ? writer.name[0] : "W"}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{writer.name}</div>
                        <div className="text-xs uppercase tracking-wider text-amber-500/90 font-mono">
                          {writer.totalSales ? `${writer.totalSales} copies sold` : "Featured Author"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* 7. Ebook Genres (Skydda Clean Technical Grid) */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32">
        <div className="space-y-4 mb-16 text-center flex flex-col items-center">
          <SectionBadge>Catalog Taxonomy</SectionBadge>
          <BlurHeading
            text="Explore Diverse Literary Genres"
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
          />
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            From gritty cyberpunk to deep philosophy, discover books categorized for every reader.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GENRES.map((genre, i) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/browse?genre=${genre.toLowerCase()}`}
                className="group flex flex-col justify-between h-32 p-6 border border-zinc-700/30 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
                </div>
                <div className="font-medium text-lg text-white group-hover:text-amber-400 transition-colors">
                  {genre}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Call To Action Section (Skydda CtaSection) */}
      <section className="relative w-full overflow-hidden border-t border-zinc-700/30">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-36">
          <div className="max-w-2xl space-y-6">
            <SectionBadge>Join the Movement</SectionBadge>
            <BlurHeading
              text="Step into stories that stay with you forever"
              className="text-4xl sm:text-5xl md:text-6xl font-normal"
            />
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Whether you are an author ready to share your original voice or a reader searching for non-cookie-cutter stories, Fable is your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 text-center shadow-lg"
              >
                Create Free Account
              </Link>
              <Link
                href="/browse"
                className="border border-white/30 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95 text-center"
              >
                Browse All Ebooks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
