"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Check = {
  id: string;
  driver_id: string;
  tires_ok: boolean;
  brakes_ok: boolean;
  lights_ok: boolean;
  fuel_ok: boolean;
  notes: string | null;
  created_at: string;
};

const LABELS: Record<string, string> = {
  tires_ok: "Tires",
  brakes_ok: "Brakes",
  lights_ok: "Lights",
  fuel_ok: "Fuel",
};

export default function ManagerChecks() {
  const supabase = createClient();
  const [checks, setChecks] = useState<Check[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("vehicle_checks")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return setMessage(error.message);
      setChecks(data as Check[]);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function problemsOf(c: Check) {
    return Object.keys(LABELS).filter((k) => !c[k as keyof Check]);
  }

  return (
    <section className="flex flex-col gap-3 max-w-xl">
      <h2 className="text-xl font-semibold">Vehicle checks</h2>
      {message && <p className="text-red-400 text-sm">{message}</p>}
      {checks.length === 0 && !message && (
        <p className="text-gray-400">No checks submitted yet.</p>
      )}
      <ul className="flex flex-col gap-2">
        {checks.map((c) => {
          const problems = problemsOf(c);
          return (
            <li key={c.id} className="rounded-lg border p-3">
              <p
                className={
                  problems.length === 0
                    ? "font-medium text-green-400"
                    : "font-medium text-red-400"
                }
              >
                {problems.length === 0
                  ? "All clear"
                  : "Issues: " + problems.map((k) => LABELS[k]).join(", ")}
              </p>
              {c.notes && <p className="text-sm">{c.notes}</p>}
              <p className="text-sm text-gray-400">
                driver {c.driver_id.slice(0, 8)} ·{" "}
                {new Date(c.created_at).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}