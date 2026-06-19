"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { paymentService } from "@/services";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function PaymentSuccessPage() {
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

    paymentService.verifyPayment(sessionId)
      .then((res) => {
        setPurchase(res.data);
        setStatus("success");
        refreshUser();
        toast.success("Purchase completed!");
      })
      .catch(() => {
        setStatus("error");
        toast.error("Could not verify payment");
      });
  }, [sessionId, refreshUser]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-dark">Payment Verification Failed</h2>
        <p className="text-gray-500">We couldn&apos;t verify your payment. Please contact support.</p>
        <Link href="/browse" className="rounded-lg bg-primary px-6 py-3 text-white hover:bg-secondary">
          Browse Ebooks
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        </motion.div>

        <h1 className="mb-2 text-2xl font-bold text-dark">Purchase Successful!</h1>
        <p className="mb-6 text-gray-500">
          Thank you for your purchase. You can now access the full ebook content.
        </p>

        {purchase?.ebookId && (
          <div className="mb-6 rounded-xl bg-gray-50 p-4 text-left">
            <p className="text-sm text-gray-500">Ebook</p>
            <p className="font-semibold text-dark">{purchase.ebookId.title || "Your ebook"}</p>
            {purchase.amount && (
              <>
                <p className="mt-2 text-sm text-gray-500">Amount</p>
                <p className="font-semibold text-primary">${purchase.amount}</p>
              </>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {purchase?.ebookId?._id && (
            <Link
              href={`/ebooks/${purchase.ebookId._id}`}
              className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:bg-secondary"
            >
              Read Ebook
            </Link>
          )}
          <Link
            href="/dashboard/user"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-dark transition hover:bg-gray-50"
          >
            My Purchases
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
