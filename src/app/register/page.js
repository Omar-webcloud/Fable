"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { authService } from "@/services";
import { ROLES } from "@/constants";
import { SectionBadge } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.USER,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success("Account registered successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] w-full items-center justify-center px-4 py-16 bg-zinc-950 text-white overflow-hidden">
      {/* Background Hero Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />

      <div className="relative z-10 w-full max-w-md border border-zinc-700/50 bg-zinc-900/90 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center text-center space-y-3">
          <SectionBadge>Registration Gateway</SectionBadge>
          <h1 className="text-3xl font-normal tracking-tight text-white">Create an Account</h1>
          <p className="text-xs text-zinc-400">
            Join the decentralized community of readers and independent authors.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-6 flex border border-zinc-700/60 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: ROLES.USER })}
            className={cn(
              "flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer",
              form.role === ROLES.USER
                ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Reader
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: ROLES.WRITER })}
            className={cn(
              "flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer",
              form.role === ROLES.WRITER
                ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Writer / Author
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Alex Rivera"
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="alex@example.com"
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Password (Min 6 Characters)
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white py-3 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md mt-4"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Complete Registration"}
          </button>
        </form>

        <div className="mt-8 border-t border-zinc-800/80 pt-6 text-center text-xs text-zinc-400">
          Already have an existing profile?{" "}
          <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400">
            Log In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
