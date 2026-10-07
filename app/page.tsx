import Link from "next/link";

export default function DriverPage() {
  return (
    <main className="p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Driver Home</h1>
      <p className="text-gray-400">
        Trips, checklist and fitness test will live here.
      </p>
      <Link href="/" className="text-blue-500 underline">
        ← Back to home
      </Link>
    </main>
  );
}