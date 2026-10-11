import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import TripPanel from "@/components/TripPanel";

export default function DriverPage() {
  return (
    <AuthGuard role="driver">
      <main className="p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Driver Home</h1>
        <p className="text-gray-400">
          Trips, checklist and fitness test will live here.
        </p>
        <TripPanel />
        <Link href="/" className="text-blue-500 underline">
          ← Back to home
        </Link>
        <LogoutButton />
      </main>
    </AuthGuard>
  );
}