"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { adminService, analyticsService, ebookService, userService } from "@/services";
import { MonthlySalesChart, GenreDistributionChart } from "@/components/Charts";
import LoadingSpinner from "@/components/LoadingSpinner";
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
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [genreData, setGenreData] = useState([]);
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminService.getStats().catch(() => ({ data: null })),
      analyticsService.getMonthlySales().catch(() => ({ data: [] })),
      analyticsService.getGenreDistribution().catch(() => ({ data: [] })),
      adminService.getTransactions().catch(() => ({ data: [] })),
    ])
      .then(([statsRes, monthlyRes, genreRes, txRes]) => {
        setStats(statsRes.data);
        setMonthlySales(monthlyRes.data || []);
        setGenreData((genreRes.data || []).map((g) => ({ name: g.genre, value: g.count })));
        setTransactions(txRes.data || []);
      })
      .finally(() => setLoading(false));

    // Fetch separately (admin-specific)
    adminService.getEbooks().then((res) => setEbooks(res.data || [])).catch(() => {});
    userService.getAll().then((res) => setUsers(res.data || [])).catch(() => {});
  }, []);

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
    <div>
      <h1 className="mb-6 text-2xl font-bold text-dark">Admin Dashboard</h1>

      {/* Tab Navigation (mobile) */}
      <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab.key ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >{tab.label}</button>
        ))}
      </div>

      {/* Analytics Overview */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Total Users", value: stats?.totalUsers ?? 0, color: "text-primary", bg: "bg-purple-50" },
              { label: "Total Writers", value: stats?.totalWriters ?? 0, color: "text-secondary", bg: "bg-violet-50" },
              { label: "Ebooks Sold", value: stats?.totalEbooksSold ?? 0, color: "text-accent", bg: "bg-amber-50" },
              { label: "Revenue", value: formatPrice(stats?.totalRevenue ?? 0), color: "text-green-600", bg: "bg-green-50" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl ${card.bg} p-5`}
              >
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-dark">Monthly Sales</h3>
              {monthlySales.length > 0 ? (
                <MonthlySalesChart data={monthlySales} />
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-400">No sales data yet</div>
              )}
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-dark">Genre Distribution</h3>
              {genreData.length > 0 ? (
                <GenreDistributionChart data={genreData} />
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-400">No ebook data yet</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Manage Users */}
      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-dark">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-primary">
                        {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteUser(u._id)}
                        className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
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
                  <th className="px-4 py-3 font-semibold text-gray-600">Writer</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ebooks.length > 0 ? ebooks.map((eb) => (
                  <tr key={eb._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-dark">{eb.title}</td>
                    <td className="px-4 py-3 text-gray-500">{eb.writerName}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatPrice(eb.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${eb.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {eb.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handlePublishToggle(eb._id, eb.status)}
                          className={`rounded px-2.5 py-1 text-xs font-medium ${eb.status === "published" ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                          {eb.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => handleDeleteEbook(eb._id)}
                          className="rounded bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100">Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No ebooks found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Transaction ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.length > 0 ? transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{tx._id}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.type === "purchase" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{tx.email}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatPrice(tx.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(tx.date || tx.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No transactions yet</td></tr>
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
