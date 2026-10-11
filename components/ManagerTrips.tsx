"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Trip = {
  id: string;
  driver_id: string;
  origin: string;
  destination: string;
  status: "active" | "completed";
  started_at: string;
};

export default function ManagerTrips() {
  const supabase = createClient();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("started_at", { ascending: false });
      if (error) return setMessage(error.message);
      setTrips(data as Trip[]);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col gap-3 max-w-xl">
      <h2 className="text-xl font-semibold">All trips</h2>
      {message && <p className="text-red-400 text-sm">{message}</p>}
      {trips.length === 0 && !message && (
        <p className="text-gray-400">No trips yet.</p>
      )}
      <ul className="flex flex-col gap-2">
        {trips.map((t) => (
          <li key={t.id} className="rounded-lg border p-3">
            <p className="font-medium">
              {t.origin} → {t.destination}
            </p>
            <p className="text-sm text-gray-400">
              {t.status} · driver {t.driver_id.slice(0, 8)} ·{" "}
              {new Date(t.started_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}