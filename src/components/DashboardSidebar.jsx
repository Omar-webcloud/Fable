"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Heart,
  PlusSquare,
  TrendingUp,
  BarChart3,
  Users,
  CreditCard,
  UserCheck,
  ChevronRight,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard/user", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/user?tab=purchases", label: "Purchase History", icon: ShoppingBag },
  { href: "/dashboard/user?tab=ebooks", label: "Purchased Ebooks", icon: BookOpen },
  { href: "/dashboard/user?tab=bookmarks", label: "Wishlist", icon: Heart },
];

const writerLinks = [
  { href: "/dashboard/writer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/writer?tab=ebooks", label: "Manage Ebooks", icon: BookOpen },
  { href: "/dashboard/writer/add-ebook", label: "Add New Ebook", icon: PlusSquare },
  { href: "/dashboard/writer?tab=sales", label: "Sales History", icon: TrendingUp },
  { href: "/dashboard/writer?tab=bookmarks", label: "Wishlist", icon: Heart },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Analytics Overview", icon: BarChart3 },
  { href: "/dashboard/admin?tab=users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin?tab=ebooks", label: "Manage Ebooks", icon: BookOpen },
  { href: "/dashboard/admin?tab=transactions", label: "Transactions", icon: CreditCard },
];

function SidebarContent() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = user?.role || "user";
  const linksMap = { user: userLinks, writer: writerLinks, admin: adminLinks };
  const links = linksMap[role] || userLinks;

  const currentTab = searchParams.get("tab") || "";

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-700/30 bg-zinc-900 text-white min-h-[calc(100vh-80px)]">
      <div className="sticky top-20 p-5 space-y-6">
        {/* User Identity Panel */}
        <div className="border border-zinc-700/60 bg-zinc-950 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-500 text-zinc-950 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name || "User"}</p>
              <span className="inline-block border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 mt-1">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const urlObj = new URL(link.href, "http://localhost");
            const linkPathname = urlObj.pathname;
            const linkTab = urlObj.searchParams.get("tab") || "";

            const isActive = pathname === linkPathname && currentTab === linkTab;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer",
                  isActive
                    ? "border-l-2 border-amber-500 bg-zinc-800/80 text-white font-semibold pl-3"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
                )}
              >
                <Icon
                  className={cn("h-4 w-4 shrink-0", isActive ? "text-amber-500" : "text-zinc-500")}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Multi-role View Switchers */}
        {role !== "user" && (
          <div className="border-t border-zinc-800/80 pt-5 space-y-2">
            <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Context Switch
            </p>
            {role === "admin" && (
              <>
                <Link
                  href="/dashboard/user"
                  className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <span>User View</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                </Link>
                <Link
                  href="/dashboard/writer"
                  className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  <span>Writer View</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                </Link>
              </>
            )}
            {role === "writer" && (
              <Link
                href="/dashboard/user"
                className="flex items-center justify-between px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <span>Reader View</span>
                <ChevronRight className="h-3 w-3 text-zinc-600" />
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default function DashboardSidebar() {
  return (
    <Suspense
      fallback={
        <aside className="w-64 shrink-0 border-r border-zinc-800 bg-zinc-900 h-[calc(100vh-80px)] sticky top-20" />
      }
    >
      <SidebarContent />
    </Suspense>
  );
}
