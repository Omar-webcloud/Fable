"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { purchaseService } from "@/services";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, formatDate, getInitials } from "@/utils";
import { useWishlist } from "@/providers/WishlistProvider";
import { SectionBadge } from "@/components/ui/SectionHeader";
import { ShoppingBag, BookOpen, Heart, User, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "purchases", label: "Purchase History", icon: ShoppingBag },
  { key: "ebooks", label: "Purchased Ebooks", icon: BookOpen },
  { key: "bookmarks", label: "Wishlist", icon: Heart },
];

function UserDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [menuOpen, setMenuOpen] = useState(false);

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
    purchaseService
      .getByUser()
      .then((res) => {
        setPurchases(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const totalSpent = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Title & Badge */}
      <div className="space-y-2">
        <SectionBadge>Reader Dashboard</SectionBadge>
        <h1 className="text-3xl font-normal tracking-tight text-white">Reader Account Overview</h1>
        <p className="text-xs text-zinc-400">
          Manage your personal library, review payment history, and browse bookmarked titles.
        </p>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="relative lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex w-full items-center justify-between border border-zinc-700 bg-zinc-900 px-4 py-3 text-xs font-mono uppercase tracking-wider text-white"
        >
          <span>{tabs.find((t) => t.key === activeTab)?.label || "Menu"}</span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute left-0 right-0 z-20 mt-1 border border-zinc-700 bg-zinc-900 shadow-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    router.push(`?tab=${tab.key}`, { scroll: false });
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-4 py-3 text-xs font-mono uppercase tracking-wider transition-colors",
                    activeTab === tab.key
                      ? "bg-zinc-800 text-amber-500 font-bold"
                      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  )}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* Identity Bar */}
          <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-amber-500 text-zinc-950 font-bold text-lg">
                {user?.image ? (
                  <img src={user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div>
                <h2 className="text-lg font-medium text-white">{user?.name}</h2>
                <p className="text-xs text-zinc-400 font-mono">{user?.email}</p>
              </div>
            </div>

            <div className="border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-500 self-start sm:self-auto">
              Role: {user?.role || "Reader"}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Purchased Books
              </div>
              <div className="text-3xl font-mono font-medium text-white">
                {purchases.length}
              </div>
              <div className="text-[11px] text-zinc-500">Instant cloud reading access</div>
            </div>

            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Total Contributed
              </div>
              <div className="text-3xl font-mono font-medium text-amber-500">
                {formatPrice(totalSpent)}
              </div>
              <div className="text-[11px] text-zinc-500">Direct author revenue support</div>
            </div>

            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Wishlist Bookmarks
              </div>
              <div className="text-3xl font-mono font-medium text-zinc-200">
                {wishlist.length}
              </div>
              <div className="text-[11px] text-zinc-500">Saved for future reading</div>
            </div>
          </div>

          {/* Recent Purchases List */}
          <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider font-mono text-zinc-300">
                Recent Library Acquisitions
              </h3>
              <button
                onClick={() => setActiveTab("purchases")}
                className="text-xs text-amber-500 hover:text-amber-400 font-mono cursor-pointer"
              >
                View Full History &rarr;
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-zinc-800/60 animate-pulse" />
                ))}
              </div>
            ) : purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div>
                      <p className="font-medium text-sm text-white">{p.ebookId?.title || "Original Manuscript"}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{formatDate(p.purchaseDate)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-medium text-amber-500">
                        {formatPrice(p.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs font-mono text-zinc-500">
                No acquisitions yet. Browse the library to discover original works.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Purchase History Tab */}
      {activeTab === "purchases" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-700/50 bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Ebook Title</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Author</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Acquisition Date</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-4 bg-zinc-800/60 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : purchases.length > 0 ? (
                    purchases.map((p) => (
                      <tr key={p._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-sans font-medium text-white text-sm">
                          {p.ebookId?.title || "—"}
                        </td>
                        <td className="px-5 py-4 text-zinc-400">{p.ebookId?.writerName || "—"}</td>
                        <td className="px-5 py-4 text-amber-500 font-bold">{formatPrice(p.amount)}</td>
                        <td className="px-5 py-4 text-zinc-400">{formatDate(p.purchaseDate)}</td>
                        <td className="px-5 py-4 text-right">
                          {p.ebookId?._id && (
                            <Link
                              href={`/ebooks/${p.ebookId._id}`}
                              className="inline-flex items-center gap-1 text-white hover:text-amber-400 transition-colors"
                            >
                              <span>Read</span>
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                        No purchase records located in this account.
                      </td>
                    </tr>
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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
            ) : purchases.length > 0 ? (
              purchases
                .filter((p) => p.ebookId)
                .map((p, i) => <EbookCard key={p._id} ebook={p.ebookId} index={i} purchased />)
            ) : (
              <div className="col-span-full border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-500 font-mono text-xs">
                No purchased titles in library.
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Wishlist Tab */}
      {activeTab === "bookmarks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loadingWishlist ? (
              Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
            ) : wishlist.length > 0 ? (
              wishlist.map((item, i) => {
                const ebook = item.ebookId || item;
                return <EbookCard key={item._id || ebook._id} ebook={ebook} index={i} />;
              })
            ) : (
              <div className="col-span-full border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-500 font-mono text-xs">
                No bookmarked items in your wishlist.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <UserDashboardContent />
    </Suspense>
  );
}
