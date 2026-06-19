"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { ebookService, writerService, bookmarkService } from "@/services";
import EbookCard from "@/components/EbookCard";
import { EbookCardSkeleton } from "@/components/SkeletonLoader";
import { formatPrice, formatDate } from "@/utils";
import api from "@/lib/axios";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "ebooks", label: "Manage Ebooks" },
  { key: "sales", label: "Sales History" },
  { key: "bookmarks", label: "Bookmarks" },
];

export default function WriterDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/writer/my-ebooks").catch(() => ({ data: [] })),
      api.get("/writer/sales").catch(() => ({ data: [] })),
      api.get("/writer/dashboard-stats").catch(() => ({ data: null })),
      bookmarkService.getAll().catch(() => ({ data: [] })),
    ])
      .then(([ebookRes, salesRes, statsRes, bookmarkRes]) => {
        setEbooks(ebookRes.data || []);
        setSales(salesRes.data || []);
        setStats(statsRes.data);
        setBookmarks(bookmarkRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-2xl font-bold text-dark">Writer Dashboard</h1>
        <Link href="/dashboard/writer/add-ebook" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary">
          + Add Ebook
        </Link>
      </div>

      {/* Tab Navigation (mobile) */}
      <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Ebooks</p>
              <p className="mt-1 text-3xl font-bold text-primary">{stats?.totalEbooks ?? ebooks.length}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="mt-1 text-3xl font-bold text-secondary">{stats?.totalSales ?? sales.length}</p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="mt-1 text-3xl font-bold text-accent">{formatPrice(stats?.totalRevenue ?? 0)}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-dark">Recent Sales</h3>
            {sales.length > 0 ? (
              <div className="space-y-3">
                {sales.slice(0, 5).map((s) => (
                  <div key={s._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div>
                      <p className="font-medium text-dark">{s.ebookId?.title || "Ebook"}</p>
                      <p className="text-sm text-gray-500">by {s.buyerId?.name || "buyer"} — {formatDate(s.purchaseDate)}</p>
                    </div>
                    <span className="font-semibold text-primary">{formatPrice(s.amount)}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No sales yet</p>}
          </div>
        </motion.div>
      )}

      {/* Manage Ebooks */}
      {activeTab === "ebooks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Sales</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                ) : ebooks.length > 0 ? (
                  ebooks.map((eb) => (
                    <tr key={eb._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-dark">{eb.title}</td>
                      <td className="px-4 py-3 text-primary font-semibold">{formatPrice(eb.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${eb.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                          {eb.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{eb.totalSales || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/dashboard/writer/edit/${eb._id}`}
                            className="rounded bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">Edit</Link>
                          <button onClick={() => handlePublishToggle(eb._id, eb.status)}
                            className={`rounded px-2.5 py-1 text-xs font-medium ${eb.status === "published" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {eb.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button onClick={() => handleDelete(eb._id)}
                            className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No ebooks yet. <Link href="/dashboard/writer/add-ebook" className="text-primary hover:underline">Add your first ebook</Link></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Sales History */}
      {activeTab === "sales" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Ebook</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Buyer</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-5 animate-pulse rounded bg-gray-100" /></td></tr>
                  ))
                ) : sales.length > 0 ? (
                  sales.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-dark">{s.ebookId?.title || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{s.buyerId?.name || "—"}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{formatPrice(s.amount)}</td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(s.purchaseDate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No sales yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Bookmarks */}
      {activeTab === "bookmarks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <EbookCardSkeleton key={i} />)
              : bookmarks.length > 0
                ? bookmarks.filter((b) => b.ebookId).map((b, i) => <EbookCard key={b._id} ebook={b.ebookId} index={i} />)
                : <p className="col-span-full py-12 text-center text-gray-400">No bookmarks</p>}
          </div>
        </motion.div>
      )}
    </div>
  );
}
