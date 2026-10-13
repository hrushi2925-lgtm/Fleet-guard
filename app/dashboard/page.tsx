
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import ManagerMap from "@/components/ManagerMap"; // NEW
import ManagerTests from "@/components/ManagerTests";
import ManagerChecks from "@/components/ManagerChecks";
import ManagerTrips from "@/components/ManagerTrips";

export default function DashboardPage() {
  return (
    <AuthGuard role="manager">
      <main className="p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>

        <p className="text-gray-400">
          The live map and alerts will live here.
        </p>

        <ManagerMap />

        <ManagerTests />
        <ManagerChecks />
        <ManagerTrips />

        <Link href="/" className="text-blue-500 underline">
          ← Back to home
        </Link>

        <LogoutButton />
      </main>
    </AuthGuard>
  );
}
