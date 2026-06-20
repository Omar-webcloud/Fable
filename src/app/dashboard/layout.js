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
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex min-h-[calc(100vh-80px)] px-4">
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      <main className="flex-1 min-w-0 bg-gray-50/50 dark:bg-dark p-3 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
