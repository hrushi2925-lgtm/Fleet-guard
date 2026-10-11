"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Trip = {
  id: string;
  origin: string;
  destination: string;
  status: "active" | "completed";
  started_at: string;
};

export default function TripPanel() {
  const supabase = createClient();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");

  async function loadTrips() {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("started_at", { ascending: false });
    if (error) return setMessage(error.message);
    setTrips(data as Trip[]);
  }

  useEffect(() => {
    loadTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startTrip(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.from("trips").insert({ origin, destination });
    if (error) return setMessage(error.message);
    setOrigin("");
    setDestination("");
    loadTrips();
  }

  async function endTrip(id: string) {
    const { error } = await supabase
      .from("trips")
      .update({ status: "completed", ended_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return setMessage(error.message);
    loadTrips();
  }

  return (
    <section className="flex flex-col gap-4 max-w-md">
      <h2 className="text-xl font-semibold">Start a trip</h2>
      <form onSubmit={startTrip} className="flex flex-col gap-3">
        <input
          placeholder="From (e.g. Rajkot)"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="rounded-lg border bg-transparent px-4 py-3"
          required
        />
        <input
          placeholder="To (e.g. Mumbai)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="rounded-lg border bg-transparent px-4 py-3"
          required
        />
        <button className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          Start trip
        </button>
      </form>

      {message && <p className="text-red-400 text-sm">{message}</p>}

      <h2 className="text-xl font-semibold mt-4">Your trips</h2>
      {trips.length === 0 && <p className="text-gray-400">No trips yet.</p>}
      <ul className="flex flex-col gap-2">
        {trips.map((t) => (
          <li key={t.id} className="rounded-lg border p-3 flex justify-between items-center">
            <div>
              <p className="font-medium">
                {t.origin} → {t.destination}
              </p>
              <p className="text-sm text-gray-400">
                {t.status} · {new Date(t.started_at).toLocaleString()}
              </p>
            </div>
            {t.status === "active" && (
              <button onClick={() => endTrip(t.id)} className="text-green-400 underline text-sm">
                End trip
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}