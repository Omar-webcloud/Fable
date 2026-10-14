"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { BookOpen, Menu, X, ArrowRight, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-700/30 bg-zinc-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-white group">
          <div className="flex h-8 w-8 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 transition-colors group-hover:border-amber-500/50">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-lg font-medium tracking-tight text-white">Fable</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors hover:text-white",
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-amber-500"
                    : "text-zinc-400"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA / Auth & Theme */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 border border-zinc-700/60 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-amber-500" />
                <span className="max-w-[120px] truncate">{user.name || "Account"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="border border-zinc-700/60 bg-transparent px-4 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:bg-white hover:text-zinc-950 active:scale-95 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-white px-4 py-1.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="text-zinc-300 hover:text-white md:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-zinc-700/30 bg-zinc-900/95 px-6 py-6 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-2 text-sm font-medium transition-colors hover:text-white",
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-amber-500 font-semibold"
                    : "text-zinc-400"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-zinc-700/30 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <User className="h-3.5 w-3.5 text-amber-500" />
                    <span>Signed in as {user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full border border-zinc-700 bg-transparent py-2.5 text-xs font-medium text-white hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full border border-zinc-700 bg-transparent py-2 text-center text-xs font-medium text-white hover:bg-zinc-800"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="w-full bg-white py-2 text-center text-xs font-medium text-zinc-950 hover:bg-zinc-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
