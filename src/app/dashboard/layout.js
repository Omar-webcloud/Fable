"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      router.push("/login");
    }
  }, [user, isPending, router]);

  if (isPending || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 text-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex min-h-[calc(100vh-80px)] border-x border-zinc-700/30 bg-zinc-950 text-white">
      <div className="hidden lg:block shrink-0">
        <DashboardSidebar />
      </div>
      <main className="flex-1 min-w-0 bg-zinc-950 p-6 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
