"use client";

import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoCloud({ className, title = "Trusted by independent authors & readers worldwide" }) {
  const logos = [
    { name: "Penguin Random House", label: "Penguin" },
    { name: "HarperCollins", label: "HarperCollins" },
    { name: "Simon & Schuster", label: "Simon & Schuster" },
    { name: "Macmillan", label: "Macmillan" },
    { name: "Hachette Book Group", label: "Hachette" },
    { name: "Goodreads", label: "Goodreads" },
    { name: "StoryGraph", label: "StoryGraph" },
    { name: "BookTok Community", label: "BookTok" },
  ];

  return (
    <div className={cn("relative w-full", className)}>
      {title && (
        <h3 className="mb-10 text-center font-normal text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
          {title}
        </h3>
      )}

      <div className="relative grid grid-cols-2 border-x border-zinc-700/30 md:grid-cols-4">
        <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-zinc-700/30" />

        {logos.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "relative flex h-24 items-center justify-center bg-zinc-900/60 p-6 text-zinc-400 hover:text-white transition-colors duration-200 border-zinc-700/30",
              idx % 2 === 0 ? "border-r" : "",
              idx % 4 !== 3 ? "md:border-r" : "md:border-r-0",
              idx < 6 ? "border-b" : "",
              idx < 4 ? "md:border-b" : "md:border-b-0"
            )}
          >
            <span className="font-semibold tracking-wider uppercase text-xs sm:text-sm text-zinc-400 select-none">
              {item.label}
            </span>

            {/* Corner Crosshairs */}
            {(idx === 0 || idx === 2 || idx === 4) && (
              <Plus
                className="-right-[12px] -bottom-[12px] absolute z-10 size-6 text-zinc-700/50"
                strokeWidth={1}
              />
            )}
            {idx === 2 && (
              <Plus
                className="-bottom-[12px] -left-[12px] absolute z-10 hidden size-6 md:block text-zinc-700/50"
                strokeWidth={1}
              />
            )}
          </div>
        ))}

        <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-zinc-700/30" />
      </div>
    </div>
  );
}
