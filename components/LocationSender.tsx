"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SEND_EVERY_MS = 10000;

export default function LocationSender() {
  const supabase = createClient();
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("Location sharing is off.");
  const watchId = useRef<number | null>(null);
  const lastSent = useRef(0);
  const userId = useRef<string | null>(null);

  async function start() {
    if (!navigator.geolocation) {
      return setStatus("This device doesn't support location.");
    }
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setStatus("You are not logged in.");
    userId.current = data.user.id;

    setStatus("Waiting for location permission...");
    setSharing(true);

    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const now = Date.now();
        if (now - lastSent.current < SEND_EVERY_MS) return;
        lastSent.current = now;

        const { error } = await supabase.from("driver_locations").upsert({
          driver_id: userId.current,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          updated_at: new Date().toISOString(),
        });
        if (error) return setStatus(error.message);
        setStatus(
          `Sharing. Last sent ${new Date().toLocaleTimeString()} ` +
            `(${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );
      },
      (err) => {
        setStatus(err.message);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  }

  function stop() {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    setSharing(false);
    setStatus("Location sharing is off.");
  }

  useEffect(() => {
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  return (
    <section className="flex flex-col gap-3 max-w-md">
      <h2 className="text-xl font-semibold">Share my location</h2>
      <button
        onClick={sharing ? stop : start}
        className={`rounded-lg px-5 py-3 text-white ${
          sharing ? "bg-red-600" : "bg-blue-600"
        }`}
      >
        {sharing ? "Stop sharing" : "Start sharing"}
      </button>
      <p className="text-sm text-gray-400">{status}</p>
    </section>
  );
}