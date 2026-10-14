"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionBadge({ children, className }) {
  return (
    <div className={cn("flex items-center gap-3 px-4 py-2 border border-zinc-700 bg-zinc-900/60 backdrop-blur-sm w-fit", className)}>
      <div className="w-2.5 h-2.5 bg-amber-500 shrink-0" />
      <span className="text-sm font-medium text-zinc-400 tracking-wide uppercase">
        {children}
      </span>
    </div>
  );
}

export function BlurHeading({ text, className, as: Component = "h2" }) {
  if (!text) return null;
  const words = text.split(" ");

  return (
    <Component className={cn("text-balance tracking-tight leading-[1.1] text-white", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0 }}
          whileInView={{ filter: "blur(0px)", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "left",
  className,
}) {
  const isCenter = align === "center";

  return (
    <div className={cn("flex flex-col gap-6 mb-12", isCenter && "items-center text-center", className)}>
      {badge && <SectionBadge>{badge}</SectionBadge>}
      {title && (
        <BlurHeading
          text={title}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal max-w-3xl"
        />
      )}
      {subtitle && (
        <p className={cn("text-balance text-base md:text-lg text-zinc-400 leading-relaxed max-w-2xl", isCenter && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
