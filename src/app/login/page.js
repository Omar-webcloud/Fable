"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { BookOpen, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/providers/AuthProvider";
import { authService } from "@/services";
import { cn } from "@/lib/utils";
import { ROLES } from "@/constants";
import { SectionBadge } from "@/components/ui/SectionHeader";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roleToggle, setRoleToggle] = useState(ROLES.USER);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleGoogleCredential = useCallback(
    async (response) => {
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
        toast.success("Authenticated with Google successfully!");
        router.push("/");
      } catch (err) {
        toast.error(err.response?.data?.error || "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [login, router, roleToggle]
  );

  useEffect(() => {
    let cleanupResize = () => {};

    const initGoogle = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) return;

      const renderButton = () => {
        const btnContainer = document.getElementById("google-signin-btn");
        if (!btnContainer) return;

        btnContainer.innerHTML = "";
        const containerWidth = btnContainer.offsetWidth;
        const buttonWidth =
          containerWidth > 0
            ? Math.min(400, Math.max(200, containerWidth))
            : typeof window !== "undefined"
            ? Math.min(400, Math.max(200, window.innerWidth - 80))
            : 382;

        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredential,
          });
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "filled_black",
            size: "large",
            width: buttonWidth,
            text: "continue_with",
            shape: "rectangular",
          });
        }
      };

      renderButton();

      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(renderButton, 200);
      };

      window.addEventListener("resize", handleResize);
      cleanupResize = () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
      };
    };

    let interval;
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initGoogle();
          clearInterval(interval);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
      cleanupResize();
    };
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
      toast.success("Welcome back to Fable!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login credentials invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] w-full items-center justify-center px-4 py-16 bg-zinc-950 text-white overflow-hidden">
      {/* Background Hero Texture from Skydda */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />

      <div className="relative z-10 w-full max-w-md border border-zinc-700/50 bg-zinc-900/90 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
        {/* Brand & Section Tag */}
        <div className="mb-6 flex flex-col items-center text-center space-y-3">
          <SectionBadge>Authentication Gateway</SectionBadge>
          <h1 className="text-3xl font-normal tracking-tight text-white">Log in to Fable</h1>
          <p className="text-xs text-zinc-400">
            Access your cloud library, reading history, and creator tools.
          </p>
        </div>

        {/* Role Toggle Switch matching Skydda technical switcher */}
        <div className="mb-6 flex border border-zinc-700/60 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => setRoleToggle(ROLES.USER)}
            className={cn(
              "flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer",
              roleToggle === ROLES.USER
                ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Reader
          </button>
          <button
            type="button"
            onClick={() => setRoleToggle(ROLES.WRITER)}
            className={cn(
              "flex-1 py-2 text-center text-xs font-mono uppercase tracking-wider transition-all cursor-pointer",
              roleToggle === ROLES.WRITER
                ? "bg-zinc-800 text-white font-bold border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            Writer / Creator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white py-3 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 cursor-pointer shadow-md mt-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Authenticate"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <div className="flex w-full justify-center">
            <div id="google-signin-btn" className="w-full" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => toast.info("Google login requires NEXT_PUBLIC_GOOGLE_CLIENT_ID")}
            className="flex w-full items-center justify-center gap-3 border border-zinc-700 bg-zinc-950 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google Single Sign-On</span>
          </button>
        )}

        <div className="mt-8 border-t border-zinc-800/80 pt-6 text-center text-xs text-zinc-400">
          New to Fable?{" "}
          <Link href="/register" className="font-medium text-amber-500 hover:text-amber-400">
            Create an Account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
