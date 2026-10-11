"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  return (
    <button onClick={handleLogout} className="text-red-400 underline">
      Log out
    </button>
  );
}