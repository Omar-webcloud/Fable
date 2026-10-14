"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";
import { SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information that you voluntarily provide to us when you register on Fable, purchase ebooks, publish manuscripts, or communicate with our operations team. This includes your name, email address, transaction tokens, and reader preferences.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We process your data strictly to fulfill reader transactions, distribute author royalties, maintain cloud reading state, verify authentic sessions, and deliver security notices. We never sell your personal reading habits or manuscript data to third-party ad networks.",
    },
    {
      title: "3. Direct Stripe Payment Processing",
      content:
        "All monetary purchases and writer payouts are executed via PCI-DSS compliant Stripe payment rails. Fable does not store your full payment card credentials on our servers.",
    },
    {
      title: "4. Data Security Protocols",
      content:
        "We enforce strict HTTPS encryption in transit, cryptographic session verification via jose/jwt tokens, and enterprise cloud database isolation. However, remember no digital transmission over the internet is completely infallible.",
    },
    {
      title: "5. Your GDPR & CCPA Rights",
      content:
        "Regardless of your location, you have the full right to request access to your stored personal data, request complete account deletion, or export your purchased library records. Email support@fable.com to exercise these rights.",
    },
  ];

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-14 space-y-4 text-center flex flex-col items-center">
          <SectionBadge>Legal &amp; Compliance</SectionBadge>
          <BlurHeading
            text="Privacy & Data Protection Policy"
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
          />
          <p className="text-zinc-400 text-xs font-mono">
            LAST REVISED: OCTOBER 2026 • JURISDICTION: GLOBAL
          </p>
        </div>

        {/* Technical Document Container */}
        <div className="border border-zinc-700/40 bg-zinc-900/60 p-8 sm:p-12 md:p-16 space-y-10 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Fable Privacy Guarantee</span>
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-zinc-200">
              At Fable, we believe reading and creative writing are personal, sovereign activities. This notice details our strict commitments to safeguarding your identity, purchases, and intellectual property.
            </p>
          </div>

          <div className="space-y-8 pt-4">
            {sections.map((sec, idx) => (
              <div key={sec.title} className="border-t border-zinc-800 pt-6 space-y-2">
                <h3 className="text-lg font-medium text-white tracking-tight">
                  {sec.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Policy Inquiries Box */}
          <div className="border border-zinc-700 bg-zinc-950 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-white">Questions regarding your data?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Reach out to our Data Protection Officer directly at privacy@fable.com.
              </p>
            </div>
            <a
              href="/contact"
              className="bg-white px-5 py-2 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-colors shrink-0 text-center"
            >
              Contact DPO
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
