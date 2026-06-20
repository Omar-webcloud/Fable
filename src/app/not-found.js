import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-dark dark:text-white">Page Not Found</h2>
      <p className="text-gray-600 dark:text-slate-400">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-secondary"
      >
        Back Home
      </Link>
    </div>
  );
}
