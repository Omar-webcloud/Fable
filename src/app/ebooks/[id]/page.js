"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ebookService, paymentService, bookmarkService } from "@/services";
import { useAuth } from "@/providers/AuthProvider";
import { formatPrice, formatDate } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWishlist } from "@/providers/WishlistProvider";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const bookmarked = isWishlisted(id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ebookService.getById(id)
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

  // Bookmarks are synced globally via useWishlist hook

  const handlePurchase = async () => {
    if (!user) {
      toast.info("Please login to purchase");
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
      toast.error(err.response?.data?.error || "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  };

  const toggleBookmark = () => {
    toggleWishlist(id);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-slate-800" style={{ height: 400 }} />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
            <div className="h-10 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <svg className="h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
        <h2 className="text-2xl font-bold text-dark dark:text-white">Ebook Not Found</h2>
        <p className="text-gray-500 dark:text-slate-450">The ebook you&apos;re looking for doesn&apos;t exist.</p>
        <button onClick={() => router.push("/browse")} className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-secondary">
          Browse Ebooks
        </button>
      </div>
    );
  }

  const isOwner = user && ebook.writerId === user._id;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 md:grid-cols-2"
      >
        {/* Cover Image */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 shadow-lg">
          {ebook.coverImage ? (
            <img src={ebook.coverImage} alt={ebook.title} className="h-full w-full object-cover" style={{ minHeight: 400 }} />
          ) : (
            <div className="flex items-center justify-center" style={{ minHeight: 400 }}>
              <svg className="h-32 w-32 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="rounded-full bg-purple-50 dark:bg-purple-950/40 px-3 py-1 text-sm font-medium text-primary dark:text-purple-300">{ebook.genre}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${ebook.status === "published" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
              {ebook.status === "published" ? "Available" : "Unpublished"}
            </span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">{ebook.title}</h1>
          <p className="mb-4 text-gray-500 dark:text-slate-400">
            by <span className="font-medium text-secondary">{ebook.writerName}</span>
          </p>

          <p className="mb-6 text-gray-600 dark:text-slate-300 leading-relaxed">{ebook.description}</p>

          <div className="mb-6 rounded-xl bg-gray-50 dark:bg-slate-950/50 border dark:border-slate-800/80 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-slate-400">Price</span>
                <p className="text-2xl font-bold text-primary dark:text-purple-400">{formatPrice(ebook.price)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400">Uploaded</span>
                <p className="font-medium text-dark dark:text-slate-200">{formatDate(ebook.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400">Total Sales</span>
                <p className="font-medium text-dark dark:text-slate-200">{ebook.totalSales || 0}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-400">Genre</span>
                <p className="font-medium text-dark dark:text-slate-200">{ebook.genre}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {purchased ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 dark:bg-green-950/30 px-6 py-3 font-semibold text-green-600 dark:text-green-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Already Purchased
              </div>
            ) : isOwner ? (
              <div className="flex-1 rounded-xl bg-gray-100 dark:bg-slate-800 px-6 py-3 text-center font-semibold text-gray-400 dark:text-slate-500">
                Your own ebook
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary disabled:opacity-50"
              >
                {purchasing ? <LoadingSpinner size="sm" /> : "Buy Now"}
              </button>
            )}

            <button
              onClick={toggleBookmark}
              className={`rounded-xl border-2 px-4 py-3 transition ${bookmarked ? "border-primary bg-primary/5 text-primary" : "border-gray-200 dark:border-slate-800 text-gray-400 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary"}`}
              aria-label="Toggle Wishlist"
            >
              <svg className="h-5 w-5" fill={bookmarked ? "#EF4444" : "none"} stroke={bookmarked ? "#EF4444" : "currentColor"} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Full Content (visible after purchase) */}
      {purchased && ebook.fullContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg border dark:border-slate-800"
        >
          <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">Full Content</h2>
          <div className="prose max-w-none text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {ebook.fullContent}
          </div>
        </motion.div>
      )}
    </div>
  );
}
