"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { adminService, analyticsService, ebookService, userService } from "@/services";
import { MonthlySalesChart, GenreDistributionChart } from "@/components/Charts";
import LoadingSpinner from "@/components/LoadingSpinner";
import SkeletonLoader, { TableRowSkeleton } from "@/components/SkeletonLoader";
import { formatPrice, formatDate } from "@/utils";
import { ROLES } from "@/constants";

const tabs = [
  { key: "overview", label: "Analytics" },
  { key: "users", label: "Manage Users" },
  { key: "ebooks", label: "Manage Ebooks" },
  { key: "transactions", label: "Transactions" },
];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  // Keep state in sync with URL search params (desktop sidebar clicks)
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingEbooks, setLoadingEbooks] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    setLoadingOverview(true);
    setLoadingUsers(true);
    setLoadingEbooks(true);
    setLoadingTransactions(true);

    Promise.all([
      adminService.getStats().catch(() => ({ data: null })),
      analyticsService.getMonthlySales().catch(() => ({ data: [] })),
      analyticsService.getGenreDistribution().catch(() => ({ data: [] })),
    ])
      .then(([statsRes, monthlyRes, genreRes]) => {
        setStats(statsRes.data);
        setMonthlySales(monthlyRes.data || []);
        setGenreData((genreRes.data || []).map((g) => ({ name: g.genre, value: g.count })));
      })
      .finally(() => setLoadingOverview(false));

    adminService.getTransactions()
      .then((res) => setTransactions(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingTransactions(false));

    adminService.getEbooks()
      .then((res) => setEbooks(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingEbooks(false));

    userService.getAll()
      .then((res) => setUsers(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.changeRole(userId, newRole);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to change role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    }
  };

  const handlePublishToggle = async (ebookId, status) => {
    try {
      if (status === "published") {
        await ebookService.unpublish(ebookId);
      } else {
        await ebookService.publish(ebookId);
      }
      setEbooks((prev) =>
        prev.map((e) => e._id === ebookId ? { ...e, status: status === "published" ? "unpublished" : "published" } : e)
      );
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const handleDeleteEbook = async (ebookId) => {
    if (!confirm("Delete this ebook?")) return;
    try {
      await ebookService.delete(ebookId);
      setEbooks((prev) => prev.filter((e) => e._id !== ebookId));
      toast.success("Ebook deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">Admin Dashboard</h1>

      {/* Tab Navigation (mobile) */}
      <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => {
            setActiveTab(tab.key);
            router.push(`?tab=${tab.key}`, { scroll: false });
          }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-primary text-white" : "bg-white dark:bg-slate-950 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-900 border dark:border-slate-800"}`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Analytics Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Users", value: stats?.totalUsers, color: "text-primary dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40" },
              { label: "Total Writers", value: stats?.totalWriters, color: "text-secondary dark:text-purple-300", bg: "bg-violet-50 dark:bg-violet-950/40" },
              { label: "Ebooks Sold", value: stats?.totalEbooksSold, color: "text-accent dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
              { label: "Revenue", value: stats !== null ? formatPrice(stats?.totalRevenue ?? 0) : null, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl ${card.bg} p-5`}
              >
                <p className="text-sm font-medium text-gray-600 dark:text-slate-300">{card.label}</p>
                {loadingOverview ? (
                  <SkeletonLoader className="mt-2 h-8 w-24" />
                ) : (
                  <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value ?? 0}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 xl:grid-cols-2">
        {/* Responsive chart containers */}
        <div className="w-full h-64 sm:h-80">
          {loadingOverview ? (
            <div className="flex h-64 flex-col justify-end gap-2 pb-4">
              {/* Skeleton loaders remain */}
              <div className="flex items-end gap-4 h-full px-4">
                <SkeletonLoader className="h-1/3 w-full" />
                <SkeletonLoader className="h-2/3 w-full" />
                <SkeletonLoader className="h-1/2 w-full" />
                <SkeletonLoader className="h-3/4 w-full" />
                <SkeletonLoader className="h-full w-full" />
                <SkeletonLoader className="h-1/4 w-full" />
              </div>
            </div>
          ) : (
            <MonthlySalesChart data={monthlySales} />
          )}
        </div>
        <div className="w-full h-64 sm:h-80">
          {loadingOverview ? (
            <div className="flex h-64 items-center justify-center">
              <SkeletonLoader className="h-48 w-48 rounded-full" />
            <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Monthly Sales</h3>
              {loadingOverview ? (
                <div className="flex h-64 flex-col justify-end gap-2 pb-4">
                  <div className="flex items-end gap-4 h-full px-4">
                    <SkeletonLoader className="h-1/3 w-full" />
                    <SkeletonLoader className="h-2/3 w-full" />
                    <SkeletonLoader className="h-1/2 w-full" />
                    <SkeletonLoader className="h-3/4 w-full" />
                    <SkeletonLoader className="h-full w-full" />
                    <SkeletonLoader className="h-1/4 w-full" />
                  </div>
                </div>
              ) : monthlySales.length > 0 ? (
                <MonthlySalesChart data={monthlySales} />
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-405 dark:text-slate-500">No sales data yet</div>
              )}
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Genre Distribution</h3>
              {loadingOverview ? (
                <div className="flex h-64 items-center justify-center">
                  <SkeletonLoader className="h-48 w-48 rounded-full" />
                </div>
              ) : genreData.length > 0 ? (
                <GenreDistributionChart data={genreData} />
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-405 dark:text-slate-500">No ebook data yet</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Manage Users */}
      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Role</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loadingUsers ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={4} />
                  ))
                ) : users.length > 0 ? users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-dark dark:text-slate-200">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="rounded border border-gray-300 dark:border-slate-800 px-2 py-1 text-sm outline-none focus:border-primary bg-white dark:bg-slate-900 text-dark dark:text-slate-100">
                        {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="rounded bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 dark:text-slate-550">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Manage Ebooks */}
      {activeTab === "ebooks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Title</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Writer</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loadingEbooks ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))
                ) : ebooks.length > 0 ? ebooks.map((eb) => (
                  <tr key={eb._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-medium text-dark dark:text-slate-200">{eb.title}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{eb.writerName}</td>
                    <td className="px-4 py-3 font-semibold text-primary dark:text-purple-400">{formatPrice(eb.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${eb.status === "published" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
                        {eb.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handlePublishToggle(eb._id, eb.status)}
                          className={`rounded px-2.5 py-1 text-xs font-medium ${eb.status === "published" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50" : "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50"}`}>
                          {eb.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => handleDeleteEbook(eb._id)}
                          className="rounded bg-red-50 dark:bg-red-950/30 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-slate-550">No ebooks found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white dark:bg-slate-950 border dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="border-b dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Transaction ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 dark:text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {loadingTransactions ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={5} />
                  ))
                ) : transactions.length > 0 ? transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-slate-400">{tx._id}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.type === "purchase" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" : "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-300"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{tx.email}</td>
                    <td className="px-4 py-3 font-semibold text-primary dark:text-purple-400">{formatPrice(tx.amount)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{formatDate(tx.date || tx.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-slate-550">No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
