export default function SkeletonLoader({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-zinc-800/80 border border-zinc-700/20 ${className}`}
    />
  );
}

export function EbookCardSkeleton() {
  return (
    <div className="overflow-hidden border border-zinc-700/30 bg-zinc-900/60 p-0 shadow-sm">
      <SkeletonLoader className="h-56 w-full" />
      <div className="space-y-3 p-5">
        <SkeletonLoader className="h-5 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="border-b border-zinc-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLoader className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
