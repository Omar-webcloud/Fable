"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";

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

    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you for reaching out! Your message has been sent.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark py-12 transition-colors duration-200">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-dark dark:text-slate-100 sm:text-5xl"
          >
            Get in <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Touch</span>
          </motion.h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-slate-400">
            Have questions, feedback, or need help? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="rounded-2xl bg-white dark:bg-slate-950 p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-bold text-dark dark:text-slate-100 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-200">Email Support</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">support@fable.com</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Response time: within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-200">Phone Support</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">+880 2-9113420</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">+880 1711-223344</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-slate-200">Office Location</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Fable Towers, Floor 14</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">42 Kazi Nazrul Islam Avenue</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Karwan Bazar, Dhaka - 1215</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-950 p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
              <h3 className="text-lg font-bold text-dark dark:text-slate-100 mb-2">Frequently Asked Questions</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                Looking for quick answers? Check out our help center or reader guidelines.
              </p>
              <a href="#" className="inline-block text-sm font-semibold text-primary dark:text-secondary hover:underline">
                Visit Help Center &rarr;
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors"
          >
            <h3 className="text-2xl font-bold text-dark dark:text-slate-100 mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all text-dark dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all text-dark dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all text-dark dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-300">Message</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all text-dark dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-secondary disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
