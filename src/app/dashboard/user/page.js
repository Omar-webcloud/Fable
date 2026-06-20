"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { purchaseService } from "@/services";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, formatDate, getInitials } from "@/utils";
import { useWishlist } from "@/providers/WishlistProvider";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "purchases", label: "Purchase History" },
  { key: "ebooks", label: "Purchased Ebooks" },
  { key: "bookmarks", label: "Wishlist" },
];

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  // Keep state in sync with URL search params (desktop sidebar clicks)
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, loading: loadingWishlist } = useWishlist();

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    purchaseService.getByUser()
      .then((res) => {
        setPurchases(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">User Dashboard</h1>

      {/* Tab Navigation (mobile) */}
      <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              router.push(`?tab=${tab.key}`, { scroll: false });
            }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key ? "bg-primary text-white" : "bg-white dark:bg-slate-950 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 border dark:border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Profile Card */}
          <div className="mb-6 rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white">
                {user?.image ? <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" /> : getInitials(user?.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-dark dark:text-white">{user?.name}</h2>
                <p className="text-gray-500 dark:text-slate-400">{user?.email}</p>
                <span className="mt-1 inline-block rounded-full bg-purple-50 dark:bg-purple-950/40 px-3 py-0.5 text-xs font-medium text-primary dark:text-purple-300 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Purchases</p>
              <p className="mt-1 text-3xl font-bold text-primary dark:text-purple-400">{purchases.length}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Amount Spent</p>
              <p className="mt-1 text-3xl font-bold text-secondary dark:text-purple-300">
                {formatPrice(purchases.reduce((sum, p) => sum + (p.amount || 0), 0))}
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Wishlist</p>
              <p className="mt-1 text-3xl font-bold text-accent dark:text-amber-400">{wishlist.length}</p>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Recent Purchases</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded bg-gray-100 dark:bg-slate-800" />)}
              </div>
            ) : purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-slate-900 border dark:border-slate-800 p-3">
                    <div>
                      <p className="font-medium text-dark dark:text-white">{p.ebookId?.title || "Ebook"}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{formatDate(p.purchaseDate)}</p>
                    </div>
                    <span className="font-semibold text-primary dark:text-purple-400">{formatPrice(p.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-slate-500">No purchases yet.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Purchase History Tab */}
      {activeTab === "purchases" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Ebook</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Writer</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td></tr>
                  ))
                ) : purchases.length > 0 ? (
                  purchases.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-dark dark:text-slate-200">{p.ebookId?.title || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{p.ebookId?.writerName || "—"}</td>
                      <td className="px-4 py-3 font-semibold text-primary dark:text-purple-400">{formatPrice(p.amount)}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{formatDate(p.purchaseDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No purchases yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Purchased Ebooks Tab */}
      {activeTab === "ebooks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
              : purchases.length > 0
                ? purchases.filter((p) => p.ebookId).map((p, i) => (
                    <EbookCard key={p._id} ebook={p.ebookId} index={i} purchased />
                  ))
                : <p className="col-span-full py-12 text-center text-gray-400">No purchased ebooks</p>}
          </div>
        </motion.div>
      )}

      {/* Wishlist Tab */}
      {activeTab === "bookmarks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loadingWishlist
              ? Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
              : wishlist.length > 0
                ? wishlist.map((item, i) => {
                    const ebook = item.ebookId || item;
                    return <EbookCard key={item._id || ebook._id} ebook={ebook} index={i} />;
                  })
                : <p className="col-span-full py-12 text-center text-gray-400 dark:text-slate-500">No items in wishlist yet</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <UserDashboardContent />
    </Suspense>
  );
}
