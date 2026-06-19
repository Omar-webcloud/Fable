"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ebookService, paymentService, bookmarkService } from "@/services";
import { useAuth } from "@/providers/AuthProvider";
import { formatPrice, formatDate } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EbookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [purchased, setPurchased] = useState(false);

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

  useEffect(() => {
    if (!user || !id) return;
    bookmarkService.getAll()
      .then((res) => {
        const bookmarks = res.data || [];
        setBookmarked(bookmarks.some((b) => (b.ebookId?._id || b.ebookId) === id));
      })
      .catch(() => {});
  }, [user, id]);

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

  const toggleBookmark = async () => {
    if (!user) {
      toast.info("Please login to bookmark");
      return;
    }
    try {
      if (bookmarked) {
        await bookmarkService.remove(id);
        setBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await bookmarkService.add(id);
        setBookmarked(true);
        toast.success("Ebook bookmarked!");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update bookmark");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="animate-pulse rounded-xl bg-gray-200" style={{ height: 400 }} />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-40 animate-pulse rounded bg-gray-200" />
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
        <h2 className="text-2xl font-bold text-dark">Ebook Not Found</h2>
        <p className="text-gray-500">The ebook you&apos;re looking for doesn&apos;t exist.</p>
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
            <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-primary">{ebook.genre}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${ebook.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
              {ebook.status === "published" ? "Available" : "Unpublished"}
            </span>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-dark">{ebook.title}</h1>
          <p className="mb-4 text-gray-500">
            by <span className="font-medium text-secondary">{ebook.writerName}</span>
          </p>

          <p className="mb-6 text-gray-600 leading-relaxed">{ebook.description}</p>

          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Price</span>
                <p className="text-2xl font-bold text-primary">{formatPrice(ebook.price)}</p>
              </div>
              <div>
                <span className="text-gray-500">Uploaded</span>
                <p className="font-medium text-dark">{formatDate(ebook.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Sales</span>
                <p className="font-medium text-dark">{ebook.totalSales || 0}</p>
              </div>
              <div>
                <span className="text-gray-500">Genre</span>
                <p className="font-medium text-dark">{ebook.genre}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {purchased ? (
              <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 px-6 py-3 font-semibold text-green-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                Already Purchased
              </div>
            ) : isOwner ? (
              <div className="flex-1 rounded-xl bg-gray-100 px-6 py-3 text-center font-semibold text-gray-400">
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
              className={`rounded-xl border-2 px-4 py-3 transition ${bookmarked ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-400 hover:border-primary hover:text-primary"}`}
            >
              <svg className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
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
          className="mt-12 rounded-2xl bg-white p-8 shadow-lg"
        >
          <h2 className="mb-4 text-2xl font-bold text-dark">Full Content</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ebook.fullContent}
          </div>
        </motion.div>
      )}
    </div>
  );
}
