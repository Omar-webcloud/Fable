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
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="relative mb-6 lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 shadow-sm focus:outline-none"
        >
          <span>{tabs.find((t) => t.key === activeTab)?.label || "Menu"}</span>
          <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-1 shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    router.push(`?tab=${tab.key}`, { scroll: false });
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2.5 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-purple-400"
                      : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </>
        )}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Card list for Mobile */}
          <div className="space-y-4 sm:hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
                  <div className="h-5 w-2/3 rounded bg-gray-100 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-slate-800" />
                  <div className="h-4 w-1/3 rounded bg-gray-100 dark:bg-slate-800" />
                </div>
              ))
            ) : purchases.length > 0 ? (
              purchases.map((p) => (
                <div key={p._id} className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-dark dark:text-slate-200">{p.ebookId?.title || "Ebook"}</h4>
                    <span className="font-bold text-primary dark:text-purple-400 shrink-0">{formatPrice(p.amount)}</span>
                  </div>
                  <div className="flex flex-col text-xs text-gray-500 dark:text-slate-400 space-y-1">
                    <p><span className="font-medium text-gray-400">Writer:</span> {p.ebookId?.writerName || "—"}</p>
                    <p><span className="font-medium text-gray-400">Date:</span> {formatDate(p.purchaseDate)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center text-gray-400">No purchases yet</div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
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
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-slate-550">No purchases yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
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
