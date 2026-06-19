"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/utils";

const userLinks = [
  { href: "/dashboard/user", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard/user?tab=purchases", label: "Purchase History", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/dashboard/user?tab=ebooks", label: "Purchased Ebooks", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/dashboard/user?tab=bookmarks", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

const writerLinks = [
  { href: "/dashboard/writer", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/dashboard/writer?tab=ebooks", label: "Manage Ebooks", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/dashboard/writer/add-ebook", label: "Add Ebook", icon: "M12 4v16m8-8H4" },
  { href: "/dashboard/writer?tab=sales", label: "Sales History", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { href: "/dashboard/writer?tab=bookmarks", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/dashboard/admin?tab=users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { href: "/dashboard/admin?tab=ebooks", label: "Manage Ebooks", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { href: "/dashboard/admin?tab=transactions", label: "Transactions", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
];

export default function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const role = user?.role || "user";
  const linksMap = { user: userLinks, writer: writerLinks, admin: adminLinks };
  const links = linksMap[role] || userLinks;

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="sticky top-16 p-4">
        <div className="mb-6 rounded-xl bg-gradient-to-br from-primary to-secondary p-4 text-white">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="font-semibold">{user?.name || "User"}</p>
          <p className="text-xs text-purple-200">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname + (typeof window !== "undefined" ? window.location.search : "") === link.href
              || (link.href.includes("?") === false && pathname === link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-purple-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-dark dark:hover:text-white"
                )}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {role !== "user" && (
          <div className="mt-4 border-t border-gray-100 dark:border-slate-800 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Other Dashboards</p>
            {role === "admin" && (
              <Link href="/dashboard/user" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-dark dark:hover:text-white">
                User View
              </Link>
            )}
            {role === "admin" && (
              <Link href="/dashboard/writer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-dark dark:hover:text-white">
                Writer View
              </Link>
            )}
            {role === "writer" && (
              <Link href="/dashboard/user" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-dark dark:hover:text-white">
                User View
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
