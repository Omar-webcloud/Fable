"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you for reaching out! Your message has been sent to our team.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen py-16 px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-14 space-y-4">
          <SectionBadge>Direct Communications</SectionBadge>
          <BlurHeading
            text="Get in Touch with the Fable Team"
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
          />
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
            Have questions about writer publishing, payments, or reader support? We typically respond within 24 business hours.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-6">
              <h3 className="text-lg font-medium text-white tracking-tight border-b border-zinc-800 pb-3">
                Channel Contacts
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Email Inquiries</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">support@fable.com</p>
                    <p className="text-[11px] text-zinc-500 mt-1">SLA: Under 24h turnaround</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Direct Line</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">+1 (800) 555-FABLE</p>
                    <p className="text-[11px] text-zinc-500 mt-1">Monday – Friday, 9am – 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-800 text-amber-500 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Global Headquarters</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                      Fable Media Labs Inc.<br />
                      548 Market Street, Suite 48201<br />
                      San Francisco, CA 94104
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Guidelines Card */}
            <div className="border border-zinc-700/40 bg-zinc-900/60 p-6 space-y-3">
              <h4 className="text-sm font-medium text-white">Looking for Author Guidelines?</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Review manuscript requirements, formatting specifications, and royalty payout protocols in our documentation.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 transition-colors pt-1"
              >
                <span>Read Publishing Overview</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 border border-zinc-700/40 bg-zinc-900/80 p-8 sm:p-10 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white tracking-tight mb-2">
              Send a Transmission
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Complete the parameters below to route your message to our operations team.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
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
                    placeholder="jane@example.com"
                    className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Writer onboarding / Publication inquiry"
                  className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Message Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Detail your request or inquiry here..."
                  className="w-full border border-zinc-700/80 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Transmit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
