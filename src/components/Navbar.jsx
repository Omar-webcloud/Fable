"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/utils";

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
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Fable
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition hover:text-primary",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-primary"
                  : "text-gray-700"
              )}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-secondary"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className={cn(
                "rounded-lg bg-primary px-4 py-2 text-white transition hover:bg-secondary",
                pathname === "/login" && "ring-2 ring-primary/30"
              )}
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
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
        <div className="border-t border-gray-100 px-4 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block py-2 font-medium",
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-primary"
                  : "text-gray-700"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} className="mt-2 font-medium text-primary">
              Logout
            </button>
          ) : (
            <Link href="/login" className="mt-2 block font-medium text-primary" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
