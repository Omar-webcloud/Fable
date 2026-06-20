"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services";
import { cn } from "@/utils";
import { ROLES } from "@/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roleToggle, setRoleToggle] = useState(ROLES.USER);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleGoogleCredential = useCallback(async (response) => {
    setLoading(true);
    try {
      const res = await authService.googleLogin(response.credential);
      const { user, token } = res.data;

      // Validate role
      if (roleToggle === ROLES.WRITER && user.role !== "writer" && user.role !== "admin") {
        toast.error("This account is not registered as a Writer.");
        setLoading(false);
        return;
      }

      login(user, token);
      toast.success("Logged in with Google successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Google login failed");
    } finally {
      setLoading(false);
    }
  }, [login, router, roleToggle]);

  useEffect(() => {
    const initGoogle = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) return;

      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "outline",
            size: "large",
            width: 382,
            text: "continue_with",
            shape: "rectangular",
          }
        );
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [handleGoogleCredential]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });
      const { user, token } = res.data;

      // Validate role
      if (roleToggle === ROLES.WRITER && user.role !== "writer" && user.role !== "admin") {
        toast.error("This account is not registered as a Writer.");
        setLoading(false);
        return;
      }

      login(user, token);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-lg border dark:border-slate-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-dark dark:text-white">Login</h1>

        {/* Role Toggle */}
        <div className="mb-6 flex rounded-lg bg-gray-100 dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setRoleToggle(ROLES.USER)}
            className={cn(
              "flex-1 rounded-md py-2 text-center text-sm font-semibold transition-all",
              roleToggle === ROLES.USER
                ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            )}
          >
            Reader
          </button>
          <button
            type="button"
            onClick={() => setRoleToggle(ROLES.WRITER)}
            className={cn(
              "flex-1 rounded-md py-2 text-center text-sm font-semibold transition-all",
              roleToggle === ROLES.WRITER
                ? "bg-white dark:bg-slate-950 text-primary shadow-sm"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
            )}
          >
            Writer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-slate-900 text-dark dark:text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-slate-800 px-4 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white dark:bg-slate-900 text-dark dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-secondary disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Login"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
          <span className="text-sm text-gray-500 dark:text-slate-400">or</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
        </div>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <div className="flex w-full justify-center">
            <div id="google-signin-btn" className="w-full" />
          </div>
        ) : (
          <button
            onClick={() => toast.info("Google login requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in env")}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-slate-800 py-3 font-semibold transition hover:bg-gray-50 dark:hover:bg-slate-900 dark:text-slate-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary dark:text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
