import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      <p className="text-gray-400">
        The live map and alerts will live here.
      </p>
      <Link href="/" className="text-blue-500 underline">
        ← Back to home
      </Link>
    </main>
  );
}