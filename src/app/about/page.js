"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles, Feather, ShieldCheck, ArrowRight, Compass, Users, DollarSign } from "lucide-react";
import { SectionBadge, BlurHeading } from "@/components/ui/SectionHeader";
import { LogoCloud } from "@/components/ui/LogoCloud";

export default function AboutPage() {
  const pillars = [
    {
      title: "Our Mission",
      description:
        "To democratize digital publishing by connecting independent authors directly with readers worldwide, ensuring maximum creative control and 100% fair earnings.",
      icon: <Compass className="w-5 h-5 text-zinc-950" />,
      tag: "Vision 01",
    },
    {
      title: "For Passionate Readers",
      description:
        "Discover genuine, untamed literature. Support creative voices directly, save stories to your lifelong cloud library, and enjoy high-readability digital typography.",
      icon: <BookOpen className="w-5 h-5 text-zinc-950" />,
      tag: "Audience 02",
    },
    {
      title: "For Modern Writers",
      description:
        "Publish manuscripts with one click, retain your copyright, monitor live reader analytics, and receive automated payouts through global Stripe infrastructure.",
      icon: <Feather className="w-5 h-5 text-zinc-950" />,
      tag: "Creators 03",
    },
  ];

  return (
    <div className="w-full bg-zinc-950 text-white min-h-screen">
      {/* 1. Hero Section matching Skydda hero */}
      <section className="relative w-full overflow-hidden border-b border-zinc-700/30">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-[1px]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-28 md:py-36 text-center flex flex-col items-center space-y-6">
          <SectionBadge>Our Philosophy</SectionBadge>
          <BlurHeading
            text="Empowering Writers. Inspiring Readers."
            className="text-4xl sm:text-6xl md:text-7xl font-normal"
          />
          <p className="max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed">
            Fable is a next-generation digital publishing ecosystem. We eliminate middlemen and static barriers to celebrate direct human storytelling.
          </p>
        </div>
      </section>

      {/* 2. Pillars Section matching Skydda Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 border-b border-zinc-700/30">
        <div className="space-y-4 mb-16 text-center flex flex-col items-center">
          <SectionBadge>Core Pillars</SectionBadge>
          <BlurHeading
            text="Built for the Next Generation of Literature"
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-zinc-700/30 bg-zinc-900/60 p-8 flex flex-col justify-between hover:border-amber-500/50 transition-colors duration-300"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center bg-amber-500">
                    {pillar.icon}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-xl font-medium text-white tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800 text-xs font-mono text-amber-500 flex items-center gap-1">
                <span>Autonomous Publishing</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Platform Trust Cloud */}
      <section className="w-full bg-zinc-900 py-20 border-b border-zinc-700/30">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
          <LogoCloud title="Supported by Modern Publishing Standards" />
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-36">
          <div className="max-w-2xl space-y-6">
            <SectionBadge>Get Started Today</SectionBadge>
            <BlurHeading
              text="Ready to share your story with the world?"
              className="text-4xl sm:text-5xl md:text-6xl font-normal"
            />
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              Create an account now to start publishing or explore thousands of original ebooks curated for discerning readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register"
                className="bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 text-center shadow-lg"
              >
                Join Fable Platform
              </Link>
              <Link
                href="/browse"
                className="border border-white/30 bg-transparent px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-white/10 active:scale-95 text-center"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
