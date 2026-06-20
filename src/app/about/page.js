"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-dark transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-dark py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(109,40,217,0.15),transparent)]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
              Our Story
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Empowering <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Writers</span>,
              <br />
              Inspiring <span className="text-accent">Readers</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Fable is a next-generation digital ebook sharing and publishing platform. We bridge the gap between independent authors and passionate readers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">Our Mission</h3>
            <p className="text-gray-600 dark:text-slate-400">
              To democratize publishing by giving authors direct access to their readers, ensuring they retain maximum control and earnings over their work.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">For Readers</h3>
            <p className="text-gray-600 dark:text-slate-400">
              Discover unique voices, support independent writers, and enjoy a premium, seamless reading experience with books saved directly to your digital library.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">For Writers</h3>
            <p className="text-gray-600 dark:text-slate-400">
              Publish ebooks instantly, access sales analytics, track transactions, and get paid securely via Stripe with clear, robust dashboards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white dark:bg-dark py-16 transition-colors duration-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-10 text-white shadow-xl md:p-16"
          >
            <h2 className="text-3xl font-bold md:text-4xl">Ready to dive in?</h2>
            <p className="mx-auto mt-4 max-w-lg text-purple-100">
              Create an account today to publish your first ebook or browse thousands of stories waiting to be read.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-primary shadow-md transition hover:bg-gray-50 hover:shadow-lg"
              >
                Join Fable
              </Link>
              <Link
                href="/browse"
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Browse Books
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
