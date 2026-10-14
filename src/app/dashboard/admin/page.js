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
import { SectionBadge } from "@/components/ui/SectionHeader";
import { BarChart3, Users, BookOpen, CreditCard, ChevronDown, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "overview", label: "Analytics Overview", icon: BarChart3 },
  { key: "users", label: "Manage Users", icon: Users },
  { key: "ebooks", label: "Manage Ebooks", icon: BookOpen },
  { key: "transactions", label: "Transactions", icon: CreditCard },
];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [menuOpen, setMenuOpen] = useState(false);

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

    adminService
      .getTransactions()
      .then((res) => setTransactions(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingTransactions(false));

    adminService
      .getEbooks()
      .then((res) => setEbooks(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingEbooks(false));

    userService
      .getAll()
      .then((res) => setUsers(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.changeRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      toast.success("User privilege role updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to alter role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Permanently purge this user account?")) return;
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User account deleted");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to purge user");
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
        prev.map((e) =>
          e._id === ebookId
            ? { ...e, status: status === "published" ? "unpublished" : "published" }
            : e
        )
      );
      toast.success("Publication status toggled");
    } catch (err) {
      toast.error(err.response?.data?.error || "Status update failed");
    }
  };

  const handleDeleteEbook = async (ebookId) => {
    if (!confirm("Permanently delete this ebook from catalog?")) return;
    try {
      await ebookService.delete(ebookId);
      setEbooks((prev) => prev.filter((e) => e._id !== ebookId));
      toast.success("Ebook removed from system");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete ebook");
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Badge */}
      <div className="space-y-2 border-b border-zinc-800 pb-6">
        <SectionBadge>Platform Telemetry</SectionBadge>
        <h1 className="text-3xl font-normal tracking-tight text-white">System Administration</h1>
        <p className="text-xs text-zinc-400">
          Global platform analytics, user privilege management, content moderation, and Stripe transaction logs.
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

      {/* Analytics Overview Tab */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          {/* 4 Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Registered Users",
                value: stats?.totalUsers,
                color: "text-white",
                desc: "Total platform accounts",
              },
              {
                label: "Active Authors",
                value: stats?.totalWriters,
                color: "text-sky-400",
                desc: "Writers with published works",
              },
              {
                label: "Ebooks Transacted",
                value: stats?.totalEbooksSold,
                color: "text-amber-500",
                desc: "Cumulative copies sold",
              },
              {
                label: "Gross Platform Revenue",
                value: stats !== null ? formatPrice(stats?.totalRevenue ?? 0) : null,
                color: "text-emerald-400",
                desc: "Total settlement volume",
              },
            ].map((card, i) => (
              <div
                key={card.label}
                className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-2"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  {card.label}
                </div>
                {loadingOverview ? (
                  <SkeletonLoader className="h-8 w-24 my-1" />
                ) : (
                  <div className={`text-3xl font-mono font-medium ${card.color}`}>
                    {card.value ?? 0}
                  </div>
                )}
                <div className="text-[11px] text-zinc-500">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium uppercase tracking-wider font-mono text-zinc-300">
                  Monthly Transaction Trajectory
                </h3>
                <span className="text-xs font-mono text-amber-500">Live Metric</span>
              </div>
              {loadingOverview ? (
                <div className="h-72 bg-zinc-950 animate-pulse" />
              ) : monthlySales.length > 0 ? (
                <MonthlySalesChart data={monthlySales} />
              ) : (
                <div className="flex h-72 items-center justify-center text-xs font-mono text-zinc-500">
                  No monthly trajectory records available.
                </div>
              )}
            </div>

            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium uppercase tracking-wider font-mono text-zinc-300">
                  Taxonomy Distribution
                </h3>
                <span className="text-xs font-mono text-sky-400">By Catalog Share</span>
              </div>
              {loadingOverview ? (
                <div className="h-72 bg-zinc-950 animate-pulse" />
              ) : genreData.length > 0 ? (
                <GenreDistributionChart data={genreData} />
              ) : (
                <div className="flex h-72 items-center justify-center text-xs font-mono text-zinc-500">
                  No publication data available.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Manage Users Tab */}
      {activeTab === "users" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-700/50 bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 uppercase tracking-wider">User Legal Name</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Email Address</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Privilege Tier</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loadingUsers ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={4} />
                    ))
                  ) : users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-sans font-medium text-white text-sm">
                          {u.name}
                        </td>
                        <td className="px-5 py-4 text-zinc-400">{u.email}</td>
                        <td className="px-5 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-amber-500 outline-none focus:border-amber-400 cursor-pointer font-mono"
                          >
                            {Object.values(ROLES).map((r) => (
                              <option key={r} value={r}>
                                {r.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="border border-red-500/30 bg-red-950/30 px-3 py-1 text-[11px] text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                          >
                            Purge User
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                        No user accounts located.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                    <th className="px-5 py-3.5 uppercase tracking-wider">Author</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loadingEbooks ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={5} />
                    ))
                  ) : ebooks.length > 0 ? (
                    ebooks.map((eb) => (
                      <tr key={eb._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-sans font-medium text-white text-sm">
                          {eb.title}
                        </td>
                        <td className="px-5 py-4 text-zinc-400">{eb.writerName}</td>
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
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
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
                              onClick={() => handleDeleteEbook(eb._id)}
                              className="border border-red-500/30 bg-red-950/30 px-3 py-1 text-[11px] text-red-400 hover:bg-red-900/50 transition-colors cursor-pointer"
                            >
                              Purge
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                        No publications in catalog.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="border border-zinc-700/40 bg-zinc-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-zinc-700/50 bg-zinc-950 text-zinc-400">
                  <tr>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Transaction Hash ID</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Type</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Payer Account</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3.5 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {loadingTransactions ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRowSkeleton key={i} cols={5} />
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-5 py-4 font-mono text-[11px] text-zinc-400">{tx._id}</td>
                        <td className="px-5 py-4">
                          <span className="border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-500 font-mono">
                            {tx.type || "PURCHASE"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-zinc-300">{tx.email}</td>
                        <td className="px-5 py-4 text-amber-500 font-bold">{formatPrice(tx.amount)}</td>
                        <td className="px-5 py-4 text-zinc-400">{formatDate(tx.date || tx.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                        No transactions recorded in ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
