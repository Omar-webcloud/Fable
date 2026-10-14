import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-6 text-center text-white bg-zinc-950">
      <div className="w-full max-w-md border border-zinc-700/50 bg-zinc-900/90 p-10 backdrop-blur-xl shadow-2xl space-y-6 flex flex-col items-center">
        <SectionBadge>404 — Signal Lost</SectionBadge>
        
        <div className="font-mono text-6xl font-light text-amber-500 tracking-tighter">
          404
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-normal text-white">Page Not Found</h2>
          <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
            The route or manuscript identifier you navigated to does not exist in the Fable registry.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white px-6 py-2.5 text-xs font-medium text-zinc-950 hover:bg-zinc-200 transition-all active:scale-95 shadow-md"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Gateway</span>
        </Link>
      </div>
    </div>
  );
}
