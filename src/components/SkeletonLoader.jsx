export default function SkeletonLoader({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function EbookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
      <SkeletonLoader className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <SkeletonLoader className="h-5 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <SkeletonLoader className="h-6 w-1/3" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLoader className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
