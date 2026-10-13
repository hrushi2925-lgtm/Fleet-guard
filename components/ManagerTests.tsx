"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Test = {
  id: string;
  driver_id: string;
  reaction_ms: number;
  passed: boolean;
  created_at: string;
};

export default function ManagerTests() {
  const supabase = createClient();
  const [tests, setTests] = useState<Test[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("fitness_tests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return setMessage(error.message);
      setTests(data as Test[]);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-col gap-3 max-w-xl">
      <h2 className="text-xl font-semibold">Fitness tests</h2>
      {message && <p className="text-red-400 text-sm">{message}</p>}
      {tests.length === 0 && !message && (
        <p className="text-gray-400">No tests taken yet.</p>
      )}
      <ul className="flex flex-col gap-2">
        {tests.map((t) => (
          <li key={t.id} className="rounded-lg border p-3">
            <p
              className={
                t.passed
                  ? "font-medium text-green-400"
                  : "font-medium text-red-400"
              }
            >
              {t.passed ? "Fit to drive" : "NOT FIT"} · {t.reaction_ms} ms
            </p>
            <p className="text-sm text-gray-400">
              driver {t.driver_id.slice(0, 8)} ·{" "}
              {new Date(t.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}