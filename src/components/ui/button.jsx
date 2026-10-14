"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  variant: {
    default: "bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95 shadow-sm",
    primary: "bg-white text-zinc-900 hover:bg-zinc-200 active:scale-95 shadow-sm",
    accent: "bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400 active:scale-95 shadow-lg shadow-amber-500/20",
    outline: "border border-zinc-700/60 bg-transparent text-white hover:bg-zinc-800/80 hover:text-white active:scale-95",
    secondary: "bg-zinc-800 text-zinc-200 border border-zinc-700/40 hover:bg-zinc-700 active:scale-95",
    ghost: "text-zinc-400 hover:text-white hover:bg-zinc-800/60 active:scale-95",
    destructive: "bg-red-600 text-white hover:bg-red-500 active:scale-95",
    link: "text-amber-500 underline-offset-4 hover:underline p-0 h-auto",
  },
  size: {
    default: "h-10 px-5 py-2 text-sm font-medium",
    sm: "h-8 px-3 text-xs font-medium",
    lg: "h-12 px-8 text-base font-medium",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  },
};

export const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          buttonVariants.variant[variant] || buttonVariants.variant.default,
          buttonVariants.size[size] || buttonVariants.size.default,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
