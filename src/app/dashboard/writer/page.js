"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { ebookService, writerService } from "@/services";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatPrice, formatDate } from "@/utils";
import api from "@/lib/axios";
import { useWishlist } from "@/providers/WishlistProvider";

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

  // Keep state in sync with URL search params (desktop sidebar clicks)
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
        toast.success("Ebook published!");
      }
      setEbooks((prev) =>
        prev.map((e) =>
          e._id === ebookId ? { ...e, status: currentStatus === "published" ? "unpublished" : "published" } : e
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (ebookId) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;
    try {
      await ebookService.delete(ebookId);
      setEbooks((prev) => prev.filter((e) => e._id !== ebookId));
      toast.success("Ebook deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark dark:text-white">Writer Dashboard</h1>
        <Link href="/dashboard/writer/add-ebook" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary">
          + Add Ebook
        </Link>
      </div>

      {/* Tab Navigation (mobile) */}
      <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => {
            setActiveTab(tab.key);
            router.push(`?tab=${tab.key}`, { scroll: false });
          }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Ebooks</p>
              <p className="mt-1 text-3xl font-bold text-primary dark:text-purple-400">{stats?.totalEbooks ?? ebooks.length}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Sales</p>
              <p className="mt-1 text-3xl font-bold text-secondary dark:text-purple-300">{stats?.totalSales ?? sales.length}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-5 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-slate-400">Revenue</p>
              <p className="mt-1 text-3xl font-bold text-accent dark:text-amber-400">{formatPrice(stats?.totalRevenue ?? 0)}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Recent Sales</h3>
            {sales.length > 0 ? (
              <div className="space-y-3">
                {sales.slice(0, 5).map((s) => (
                  <div key={s._id} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-slate-850 p-3">
                    <div>
                      <p className="font-medium text-dark dark:text-white">{s.ebookId?.title || "Ebook"}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">by {s.buyerId?.name || "buyer"} — {formatDate(s.purchaseDate)}</p>
                    </div>
                    <span className="font-semibold text-primary dark:text-purple-400">{formatPrice(s.amount)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400 dark:text-slate-500">No sales yet</p>}
          </div>
        </motion.div>
      )}

      {/* Manage Ebooks */}
      {activeTab === "ebooks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Sales</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td></tr>
                  ))
                ) : ebooks.length > 0 ? (
                  ebooks.map((eb) => (
                    <tr key={eb._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-dark dark:text-slate-200">{eb.title}</td>
                      <td className="px-4 py-3 text-primary dark:text-purple-400 font-semibold">{formatPrice(eb.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${eb.status === "published" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
                          {eb.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{eb.totalSales || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/writer/edit/${eb._id}`}
                            className="rounded bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50">Edit</Link>
                          <button onClick={() => handlePublishToggle(eb._id, eb.status)}
                            className={`rounded px-2.5 py-1 text-xs font-medium ${eb.status === "published" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50" : "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"}`}>
                            {eb.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button onClick={() => handleDelete(eb._id)}
                            className="rounded bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No ebooks yet. <Link href="/dashboard/writer/add-ebook" className="text-primary dark:text-purple-400 hover:underline">Add your first ebook</Link></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Sales History */}
      {activeTab === "sales" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Ebook</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Buyer</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-gray-100 dark:bg-slate-800" /></td></tr>
                  ))
                ) : sales.length > 0 ? (
                  sales.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-medium text-dark dark:text-slate-200">{s.ebookId?.title || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{s.buyerId?.name || "—"}</td>
                      <td className="px-4 py-3 font-semibold text-primary dark:text-purple-400">{formatPrice(s.amount)}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{formatDate(s.purchaseDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-slate-500">No sales yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Wishlist */}
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
                : <p className="col-span-full py-12 text-center text-gray-400 dark:text-slate-500">No items in wishlist</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function WriterDashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <WriterDashboardContent />
    </Suspense>
  );
}
