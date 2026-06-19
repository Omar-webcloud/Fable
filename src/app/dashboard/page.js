"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isPending } = useAuth();

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.push("/login");
      return;
    }
    switch (user.role) {
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "writer":
        router.push("/dashboard/writer");
        break;
      default:
        router.push("/dashboard/user");
    }
  }, [user, isPending, router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
