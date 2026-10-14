"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { ebookService } from "@/services";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, formatDate } from "@/utils";
import api from "@/lib/axios";
import { useWishlist } from "@/providers/WishlistProvider";
import { SectionBadge } from "@/components/ui/SectionHeader";
import { Plus, BookOpen, TrendingUp, DollarSign, Edit3, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "ebooks", label: "Manage Ebooks" },
  { key: "sales", label: "Sales History" },
  { key: "bookmarks", label: "Wishlist" },
];

function WriterDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wishlist, loading: loadingWishlist } = useWishlist();

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "writer" && user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (!user || (user.role !== "writer" && user.role !== "admin")) return;

    setLoading(true);
    Promise.all([
      api.get("/writer/my-ebooks").catch(() => ({ data: [] })),
      api.get("/writer/sales").catch(() => ({ data: [] })),
      api.get("/writer/dashboard-stats").catch(() => ({ data: null })),
    ])
      .then(([ebookRes, salesRes, statsRes]) => {
        setEbooks(ebookRes.data || []);
        setSales(salesRes.data || []);
        setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handlePublishToggle = async (ebookId, currentStatus) => {
    try {
      if (currentStatus === "published") {
        await ebookService.unpublish(ebookId);
        toast.success("Ebook unpublished");
      } else {
        await ebookService.publish(ebookId);
        toast.success("Ebook published to library!");
      }
      setEbooks((prev) =>
        prev.map((e) =>
          e._id === ebookId
            ? { ...e, status: currentStatus === "published" ? "unpublished" : "published" }
            : e
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update publication status");
    }
  };

  const handleDelete = async (ebookId) => {
    if (!confirm("Are you sure you want to permanently delete this ebook?")) return;
    try {
      await ebookService.delete(ebookId);
      setEbooks((prev) => prev.filter((e) => e._id !== ebookId));
      toast.success("Ebook deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete ebook");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Add Ebook CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="space-y-2">
          <SectionBadge>Creator Operations</SectionBadge>
          <h1 className="text-3xl font-normal tracking-tight text-white">Writer Studio</h1>
          <p className="text-xs text-zinc-400">
            Publish original manuscripts, monitor gross earnings, and inspect real-time unit sales.
          </p>
        </div>

        <Link
          href="/dashboard/writer/add-ebook"
          className="flex items-center justify-center gap-2 bg-white px-5 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Ebook</span>
        </Link>
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
          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Published Titles
              </div>
              <div className="text-3xl font-mono font-medium text-white">
                {stats?.totalEbooks ?? ebooks.length}
              </div>
              <div className="text-[11px] text-zinc-500">Active titles in catalog</div>
            </div>

            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Total Units Sold
              </div>
              <div className="text-3xl font-mono font-medium text-white">
                {stats?.totalSales ?? sales.length}
              </div>
              <div className="text-[11px] text-zinc-500">Individual reader purchases</div>
            </div>

            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Creator Revenue
              </div>
              <div className="text-3xl font-mono font-medium text-amber-500">
                {formatPrice(stats?.totalRevenue ?? 0)}
              </div>
              <div className="text-[11px] text-zinc-500">Direct Stripe author royalties</div>
            </div>
          </div>

          {/* Recent Sales Activity */}
          <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-medium uppercase tracking-wider font-mono text-zinc-300">
                Recent Reader Sales Activity
              </h3>
              <button
                onClick={() => setActiveTab("sales")}
                className="text-xs text-amber-500 hover:text-amber-400 font-mono cursor-pointer"
              >
                All Sales History &rarr;
              </button>
            </div>

            {sales.length > 0 ? (
              <div className="space-y-3">
                {sales.slice(0, 5).map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div>
                      <p className="font-medium text-sm text-white">{s.ebookId?.title || "Original Title"}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        Purchased by {s.buyerId?.name || "Reader"} • {formatDate(s.purchaseDate)}
                      </p>
                    </div>
                    <span className="font-mono text-sm font-medium text-amber-500">
                      {formatPrice(s.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs font-mono text-zinc-500">
                No reader transactions recorded yet.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Manage Ebooks Tab */}
      {activeTab === "ebooks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono min-w-[700px]">
                <thead className="border-b border-zinc-700/50 bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Manuscript Title</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Copies Sold</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={5} className="px-5 py-4">
                          <div className="h-4 bg-zinc-800/60 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : ebooks.length > 0 ? (
                    ebooks.map((eb) => (
                      <tr key={eb._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-sans font-medium text-white text-sm">
                          {eb.title}
                        </td>
                        <td className="px-5 py-4 text-amber-500 font-bold">{formatPrice(eb.price)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border",
                              eb.status === "published"
                                ? "border-green-500/40 bg-green-950/40 text-green-400"
                                : "border-zinc-700 bg-zinc-800 text-zinc-400"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5",
                                eb.status === "published" ? "bg-green-500" : "bg-zinc-500"
                              )}
                            />
                            {eb.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-300">{eb.totalSales || 0}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/writer/edit/${eb._id}`}
                              className="border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-[11px] text-zinc-200 hover:border-zinc-500 hover:text-white transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handlePublishToggle(eb._id, eb.status)}
                              className={cn(
                                "border px-3 py-1 text-[11px] transition-colors cursor-pointer",
                                eb.status === "published"
                                  ? "border-amber-500/40 bg-amber-950/40 text-amber-400 hover:bg-amber-900/60"
                                  : "border-green-500/40 bg-green-950/40 text-green-400 hover:bg-green-900/60"
                              )}
                            >
                              {eb.status === "published" ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() => handleDelete(eb._id)}
                              className="border border-red-500/30 bg-red-950/30 px-3 py-1 text-[11px] text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                        No publications yet.{" "}
                        <Link
                          href="/dashboard/writer/add-ebook"
                          className="text-amber-500 hover:text-amber-400 underline ml-1"
                        >
                          Publish your first ebook &rarr;
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sales History Tab */}
      {activeTab === "sales" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-700/50 bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Publication</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Buyer Identifier</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Gross Royalty</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Settlement Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="px-5 py-4">
                          <div className="h-4 bg-zinc-800/60 animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : sales.length > 0 ? (
                    sales.map((s) => (
                      <tr key={s._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-sans font-medium text-white text-sm">
                          {s.ebookId?.title || "—"}
                        </td>
                        <td className="px-5 py-4 text-zinc-400">{s.buyerId?.name || s.buyerId || "—"}</td>
                        <td className="px-5 py-4 text-amber-500 font-bold">{formatPrice(s.amount)}</td>
                        <td className="px-5 py-4 text-zinc-400">{formatDate(s.purchaseDate)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                        No sales transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

export default function WriterDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <WriterDashboardContent />
    </Suspense>
  );
}
