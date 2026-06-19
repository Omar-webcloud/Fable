"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardLayout({ children }) {
  const { user, isPending } = useAuth();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      <main className="flex-1 bg-gray-50/50 p-4 md:p-8">{children}</main>
    </div>
  );
}
