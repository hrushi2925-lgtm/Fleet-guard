import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import LocationSender from "@/components/LocationSender";
import ReactionTest from "@/components/ReactionTest";
import ChecklistForm from "@/components/ChecklistForm";
import TripPanel from "@/components/TripPanel";

export default function DriverPage() {
  return (
    <AuthGuard role="driver">
      <main className="p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Driver Home</h1>
        <LocationSender />
        <ReactionTest />
        <ChecklistForm />
        <TripPanel />
        <Link href="/" className="text-blue-500 underline">
          ← Back to home
        </Link>
        <LogoutButton />
      </main>
    </AuthGuard>
  );
}