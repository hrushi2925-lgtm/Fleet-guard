"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthGuard({
  role,
  children,
}: {
  role: "driver" | "manager";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) return router.replace("/login");

      const userRole =
        user.user_metadata.role === "manager" ? "manager" : "driver";
      if (userRole !== role) {
        return router.replace(userRole === "manager" ? "/dashboard" : "/driver");
      }
      setReady(true);
    });
  }, [role, router]);

  if (!ready) return <p className="p-8 text-gray-400">Loading...</p>;
  return <>{children}</>;
}