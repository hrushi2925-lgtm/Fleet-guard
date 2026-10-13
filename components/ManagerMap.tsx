"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { createClient } from "@/lib/supabase/client";

type Loc = {
  driver_id: string;
  lat: number;
  lng: number;
  updated_at: string;
};

export default function ManagerMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    let cleanup = () => {};

    async function init() {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current).setView([22.3, 70.8], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const markers = new Map<string, import("leaflet").CircleMarker>();

      function show(loc: Loc) {
        const label =
          "Driver " + loc.driver_id.slice(0, 8) +
          "<br/>Updated " + new Date(loc.updated_at).toLocaleTimeString();
        const existing = markers.get(loc.driver_id);
        if (existing) {
          existing.setLatLng([loc.lat, loc.lng]);
          existing.setPopupContent(label);
        } else {
          const marker = L.circleMarker([loc.lat, loc.lng], {
            radius: 10,
            color: "#2563eb",
            fillColor: "#3b82f6",
            fillOpacity: 0.8,
          })
            .addTo(map)
            .bindPopup(label);
          markers.set(loc.driver_id, marker);
        }
        setCount(markers.size);
      }

      const { data, error } = await supabase.from("driver_locations").select("*");
      if (cancelled) {
        map.remove();
        return;
      }
      if (error) {
        setMessage(error.message);
      } else if (data) {
        (data as Loc[]).forEach(show);
        if (data.length > 0) map.setView([data[0].lat, data[0].lng], 11);
      }

      const channel = supabase
        .channel("driver-locations")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "driver_locations" },
          (payload) => {
            if (payload.new && "lat" in payload.new) show(payload.new as Loc);
          }
        )
        .subscribe();

      cleanup = () => {
        supabase.removeChannel(channel);
        map.remove();
      };
    }

    init();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <section className="flex flex-col gap-3 max-w-xl">
      <h2 className="text-xl font-semibold">Live map</h2>
      {message && <p className="text-red-400 text-sm">{message}</p>}
      <div ref={containerRef} className="relative z-0 h-80 w-full rounded-lg" />
      <p className="text-sm text-gray-400">
        {count === 0
          ? "No drivers are sharing their location right now."
          : `${count} driver${count === 1 ? "" : "s"} on the map. Tap a dot for details.`}
      </p>
    </section>
  );
}