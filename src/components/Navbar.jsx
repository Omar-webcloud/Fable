"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/utils";
import ThemeToggle from "./ThemeToggle";

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
    { href: "/browse", label: "Browse Ebooks" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 transition-transform duration-300 hover:scale-105 active:scale-95">
          <img src="/logo.png" alt="Fable Logo" className="h-9 w-auto object-contain dark:brightness-110" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-medium transition-colors duration-300 hover:text-primary dark:hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-primary after:w-full"
                  : "text-gray-700 dark:text-slate-300"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-primary px-4 py-2 text-white shadow-sm transition-all duration-300 hover:bg-secondary hover:shadow-md hover:-translate-y-0.5 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                "rounded-lg bg-primary px-4 py-2 text-white shadow-sm transition-all duration-300 hover:bg-secondary hover:shadow-md hover:-translate-y-0.5 active:scale-95",
                pathname === "/login" && "ring-2 ring-primary/30 shadow-none hover:shadow-none hover:translate-y-0"
              )}
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-gray-700 dark:text-slate-200 transition-transform active:scale-95"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 py-4 md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block py-2 font-medium",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-primary"
                  : "text-gray-700 dark:text-slate-300"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-900 pt-4">
            {user ? (
              <button onClick={handleLogout} className="font-medium text-primary hover:text-secondary">
                Logout
              </button>
            ) : (
              <Link href="/login" className="font-medium text-primary hover:text-secondary" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
