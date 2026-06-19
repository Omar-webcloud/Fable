import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-dark">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/dashboard/user"
          className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-primary">User Dashboard</h2>
          <p className="mt-2 text-gray-600">Purchases, bookmarks, and profile</p>
        </Link>
        <Link
          href="/dashboard/writer"
          className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-primary">Writer Dashboard</h2>
          <p className="mt-2 text-gray-600">Manage ebooks and view sales</p>
        </Link>
        <Link
          href="/dashboard/admin"
          className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-primary">Admin Dashboard</h2>
          <p className="mt-2 text-gray-600">Analytics and platform management</p>
        </Link>
      </div>
    </div>
  );
}
