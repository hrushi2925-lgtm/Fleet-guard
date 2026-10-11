"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ITEMS = [
  { key: "tires_ok", label: "Tires and pressure" },
  { key: "brakes_ok", label: "Brakes" },
  { key: "lights_ok", label: "Lights and indicators" },
  { key: "fuel_ok", label: "Fuel for the route" },
] as const;

type Key = (typeof ITEMS)[number]["key"];

export default function ChecklistForm() {
  const supabase = createClient();
  const [checks, setChecks] = useState<Record<Key, boolean>>({
    tires_ok: false,
    brakes_ok: false,
    lights_ok: false,
    fuel_ok: false,
  });
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.from("vehicle_checks").insert({ ...checks, notes });
    if (error) return setMessage(error.message);

    const problems = ITEMS.filter((i) => !checks[i.key]).map((i) => i.label);
    setMessage(
      problems.length === 0
        ? "Vehicle check saved. All good to go."
        : "Saved. Issues flagged: " + problems.join(", ")
    );
    setNotes("");
  }

  return (
    <section className="flex flex-col gap-3 max-w-md">
      <h2 className="text-xl font-semibold">Vehicle check</h2>
      <form onSubmit={submit} className="flex flex-col gap-3">
        {ITEMS.map((item) => (
          <label key={item.key} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checks[item.key]}
              onChange={(e) => setChecks({ ...checks, [item.key]: e.target.checked })}
              className="h-5 w-5"
            />
            {item.label}
          </label>
        ))}
        <textarea
          placeholder="Notes (anything wrong or unusual?)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-lg border bg-transparent px-4 py-3"
          rows={3}
        />
        <button className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          Submit check
        </button>
      </form>
      {message && <p className="text-sm text-yellow-400">{message}</p>}
    </section>
  );
}