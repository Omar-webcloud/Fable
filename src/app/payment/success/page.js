"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { CheckCircle2, AlertCircle, BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { paymentService } from "@/services";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionBadge } from "@/components/ui/SectionHeader";
import Link from "next/link";
import { formatPrice } from "@/utils";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    paymentService
      .verifyPayment(sessionId)
      .then((res) => {
        setPurchase(res.data);
        setStatus("success");
        refreshUser();
        toast.success("Purchase verified & added to your library!");
      })
      .catch(() => {
        setStatus("error");
        toast.error("Could not verify payment session");
      });
  }, [sessionId, refreshUser]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Confirming Stripe cryptographic verification...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center border border-red-500/40 bg-red-950/40 text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-normal text-white">Payment Verification Failed</h2>
          <p className="text-sm text-zinc-400 max-w-md">
            We could not verify the Stripe transaction session. If you were charged, please contact Fable support with your transaction reference.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/browse"
            className="bg-white px-6 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            Browse Library
          </Link>
          <Link
            href="/contact"
            className="border border-zinc-700 bg-transparent px-6 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg border border-zinc-700/50 bg-zinc-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-8"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <SectionBadge>Transaction Settlement</SectionBadge>
          <div className="flex h-16 w-16 items-center justify-center border border-green-500/50 bg-green-950/50 text-green-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-white">Purchase Confirmed</h1>
          <p className="text-xs text-zinc-400 max-w-sm">
            Your transaction has been validated and the full original manuscript is unlocked in your library.
          </p>
        </div>

        {/* Receipt Box */}
        {purchase && (
          <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-500">
              <span>RECEIPT SPECIFICATION</span>
              <span className="text-amber-500">STRIPE SETTLED</span>
            </div>

            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-500">Publication:</span>
              <span className="text-white font-medium truncate max-w-[220px]">
                {purchase.ebookId?.title || "Original Publication"}
              </span>
            </div>

            {purchase.amount && (
              <div className="flex justify-between text-zinc-300">
                <span className="text-zinc-500">Amount Paid:</span>
                <span className="text-amber-500 font-bold">${purchase.amount}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-300">
              <span className="text-zinc-500">Delivery:</span>
              <span>Instant Digital Access</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {purchase?.ebookId?._id && (
            <Link
              href={`/ebooks/${purchase.ebookId._id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-white px-6 py-3 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all text-center shadow-md cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Ebook Now</span>
            </Link>
          )}

          <Link
            href="/dashboard/user"
            className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 bg-zinc-950 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors text-center cursor-pointer"
          >
            <span>User Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
