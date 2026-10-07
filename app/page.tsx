import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">FleetGuard</h1>
      <p className="text-gray-400 max-w-md text-center">
        Keeping long-haul drivers safe and deliveries on track.
      </p>
      <div className="flex gap-4">
        <Link href="/driver" className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          I'm a Driver
        </Link>
        <Link href="/dashboard" className="rounded-lg border px-5 py-3">
          I'm a Manager
        </Link>
      </div>
    </main>
  );
}