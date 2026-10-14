"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Heart, BookOpen, CheckCircle2, ShieldCheck, ArrowLeft, Gift, Sparkles, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ebookService, paymentService } from "@/services";
import { useAuth } from "@/providers/AuthProvider";
import { formatPrice, formatDate } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWishlist } from "@/providers/WishlistProvider";
import { SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";
import { FormattedReader } from "@/components/ui/FormattedReader";
import { cn } from "@/lib/utils";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [isReadingFree, setIsReadingFree] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const bookmarked = isWishlisted(id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ebookService
      .getById(id)
      .then((res) => {
        setEbook(res.data);
        if (user?.purchasedBooks) {
          setPurchased(user.purchasedBooks.some((b) => (b._id || b) === id));
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          toast.error("Ebook not found");
        } else {
          toast.error("Failed to load ebook");
        }
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handlePurchase = async () => {
    if (!user) {
      toast.info("Please log in to purchase this ebook");
      router.push("/login");
      return;
    }
    setPurchasing(true);
    try {
      const res = await paymentService.createCheckout(id);
      const { url } = res.data;
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Purchase initialization failed");
    } finally {
      setPurchasing(false);
    }
  };

  const handleReadFree = () => {
    setIsReadingFree(true);
    setTimeout(() => {
      const readerElem = document.getElementById("reader-content");
      if (readerElem) {
        readerElem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const toggleBookmark = () => {
    toggleWishlist(id);
  };

  if (loading) {
    return (
      <div className="w-full bg-zinc-950 min-h-screen py-20 px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="h-[500px] border border-zinc-800 bg-zinc-900/60 animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 w-1/3 bg-zinc-800 animate-pulse" />
              <div className="h-12 w-3/4 bg-zinc-800 animate-pulse" />
              <div className="h-4 w-full bg-zinc-800 animate-pulse" />
              <div className="h-4 w-2/3 bg-zinc-800 animate-pulse" />
              <div className="h-28 bg-zinc-800 animate-pulse" />
              <div className="h-12 w-48 bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="w-full bg-zinc-950 min-h-screen flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="flex h-20 w-20 items-center justify-center border border-zinc-700 bg-zinc-900 text-zinc-500 mb-6">
          <BookOpen className="h-10 w-10 stroke-[1.2]" />
        </div>
        <h2 className="text-2xl font-normal text-white">Ebook Not Found</h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-sm">
          The publication you are trying to view might have been moved or removed by the author.
        </p>
        <button
          onClick={() => router.push("/browse")}
          className="mt-6 bg-white px-6 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const isOwner = user && ebook.writerId === user._id;
  const isFree = Boolean(ebook.isFree || Number(ebook.price) === 0);
  const canRead = isFree || purchased || isOwner || isReadingFree;

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Back Link */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Library</span>
        </Link>

        {/* 2-Column Product Detail Layout */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Cover Image & Framing */}
          <div className="lg:col-span-5">
            <div className="relative border border-zinc-700/40 bg-zinc-900/60 p-2 shadow-2xl">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950 border border-zinc-800">
                {ebook.coverImage ? (
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 p-8 text-zinc-600">
                    <BookOpen className="h-16 w-16 text-zinc-700 stroke-[1.2] mb-3" />
                    <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">
                      Original Edition
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />

                {/* Free Ebook Banner over cover */}
                {isFree && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 border border-emerald-500/50 bg-emerald-950/80 px-3 py-1 text-xs font-mono uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                    <Gift className="h-3.5 w-3.5" />
                    <span>Free Ebook</span>
                  </div>
                )}
              </div>

              {/* Verified Original watermark */}
              <div className="flex items-center justify-between p-3 text-[11px] font-mono uppercase tracking-wider text-zinc-500 border-t border-zinc-800/80 mt-2">
                <span>Format: Digital EPUB / Text</span>
                <span className={cn(isFree ? "text-emerald-400 font-bold" : "text-amber-500")}>
                  {isFree ? "Free Open Access" : "Direct Author Support"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Specs & Action Buttons */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <SectionBadge>{ebook.genre || "Literary Fiction"}</SectionBadge>
                {isFree ? (
                  <div className="flex items-center gap-1.5 border border-emerald-500/50 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400 font-mono">
                    <span className="h-1.5 w-1.5 bg-emerald-400" />
                    <span>Free Online Reading</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 font-mono">
                    <div className={cn("h-1.5 w-1.5", ebook.status === "published" ? "bg-green-500" : "bg-zinc-500")} />
                    <span>{ebook.status === "published" ? "Live on Fable" : "Draft"}</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
                {ebook.title}
              </h1>

              <p className="text-sm text-zinc-400">
                Authored by{" "}
                <span className="text-white font-medium hover:text-amber-400 transition-colors">
                  {ebook.writerName || "Independent Writer"}
                </span>
              </p>
            </div>

            {/* Synopsis */}
            <p className="text-zinc-300 leading-relaxed text-base font-normal">
              {ebook.description}
            </p>

            {/* Technical Specifications Panel */}
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Price</div>
                  <div
                    className={cn(
                      "text-2xl font-mono font-medium mt-1",
                      isFree ? "text-emerald-400 font-bold" : "text-amber-500"
                    )}
                  >
                    {isFree ? "FREE" : formatPrice(ebook.price)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Published</div>
                  <div className="text-sm font-mono text-zinc-200 mt-1.5">
                    {formatDate(ebook.createdAt)}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Total Readers</div>
                  <div className="text-sm font-mono text-zinc-200 mt-1.5">
                    {ebook.totalSales || 0} readers
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">Access Mode</div>
                  <div className="text-sm font-mono text-zinc-200 mt-1.5 flex items-center gap-1">
                    {isFree ? (
                      <>
                        <Gift className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Open Access</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                        <span>Stripe Protected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {isFree ? (
                /* FREE EBOOK: Direct Read without pay gateway */
                <button
                  onClick={handleReadFree}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold px-8 py-3.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Read Free Now &mdash; Instant Access</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : purchased ? (
                <div className="flex-1 flex items-center justify-between gap-4 border border-green-500/40 bg-green-950/40 px-6 py-3.5 text-sm font-medium text-green-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Purchased &amp; In Library</span>
                  </div>
                  <button
                    onClick={() => {
                      document.getElementById("reader-content")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs font-mono uppercase underline text-white hover:text-green-300"
                  >
                    Open Reader &darr;
                  </button>
                </div>
              ) : isOwner ? (
                <div className="flex-1 border border-zinc-700 bg-zinc-900/80 px-6 py-3.5 text-center text-sm font-medium text-zinc-400">
                  You are the creator of this ebook
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 flex items-center justify-center gap-2 bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {purchasing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Redirecting to Checkout...</span>
                    </>
                  ) : (
                    <span>Buy &amp; Read Now &mdash; {formatPrice(ebook.price)}</span>
                  )}
                </button>
              )}

              {/* Wishlist toggle */}
              <button
                onClick={toggleBookmark}
                className={cn(
                  "flex h-12 items-center justify-center gap-2 border px-6 text-sm font-medium transition-all duration-200 cursor-pointer",
                  bookmarked
                    ? "border-red-500/60 bg-red-950/60 text-red-400"
                    : "border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500 hover:text-white"
                )}
                aria-label="Toggle Wishlist"
              >
                <Heart className={cn("h-4 w-4", bookmarked && "fill-red-500 text-red-500")} />
                <span>{bookmarked ? "In Wishlist" : "Save to Wishlist"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Reader Section (Unlocked for Free Books, Purchases, or Creator) */}
        {canRead && ebook.fullContent && (
          <motion.div
            id="reader-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 border border-zinc-700/40 bg-zinc-900/90 p-8 sm:p-12 md:p-16 shadow-2xl space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="space-y-1">
                <SectionBadge>
                  {isFree ? "Free Open Reader" : "Full Edition Reader"}
                </SectionBadge>
                <h2 className="text-2xl font-normal text-white">{ebook.title}</h2>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                {isFree ? (
                  <span className="text-emerald-400 font-bold">Free Unrestricted Reading</span>
                ) : (
                  <span className="text-amber-500">Verified Purchased Copy</span>
                )}
                <span>•</span>
                <span>Complete Text</span>
              </div>
            </div>

            {/* Beautiful formatted reader using FormattedReader component */}
            <div className="max-w-none text-zinc-200 pt-4">
              <FormattedReader content={ebook.fullContent} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
