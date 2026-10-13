"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ROUNDS = 3;
const PASS_MS = 500; // average slower than this = not fit

type Phase = "idle" | "waiting" | "go" | "early" | "done";

export default function ReactionTest() {
  const supabase = createClient();
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [result, setResult] = useState<{ avg: number; passed: boolean } | null>(null);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTime = useRef(0);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function nextRound() {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 3000;
    timer.current = setTimeout(() => {
      startTime.current = performance.now();
      setPhase("go");
    }, delay);
  }

  function begin() {
    setTimes([]);
    setResult(null);
    setMessage("");
    nextRound();
  }

  async function finish(all: number[]) {
    const avg = Math.round(all.reduce((a, b) => a + b, 0) / all.length);
    const passed = avg <= PASS_MS;
    setResult({ avg, passed });
    setPhase("done");
    const { error } = await supabase
      .from("fitness_tests")
      .insert({ reaction_ms: avg, passed });
    if (error) setMessage(error.message);
  }

  function handleTap() {
    if (phase === "waiting") {
      if (timer.current) clearTimeout(timer.current);
      setPhase("early");
    } else if (phase === "go") {
      const ms = Math.round(performance.now() - startTime.current);
      const updated = [...times, ms];
      setTimes(updated);
      if (updated.length < ROUNDS) nextRound();
      else finish(updated);
    }
  }

  const boxStyle: Record<Phase, string> = {
    idle: "bg-blue-600",
    waiting: "bg-red-600",
    go: "bg-green-500",
    early: "bg-yellow-600",
    done: "bg-gray-700",
  };

  const boxText: Record<Phase, string> = {
    idle: "Tap to start",
    waiting: "Wait for green...",
    go: "TAP NOW!",
    early: "Too early! Tap to retry this round",
    done: "Finished",
  };

  return (
    <section className="flex flex-col gap-3 max-w-md">
      <h2 className="text-xl font-semibold">Fitness test</h2>
      <p className="text-sm text-gray-400">
        Tap as soon as the box turns green. {ROUNDS} rounds.
      </p>

      <button
        onPointerDown={() => {
          if (phase === "idle" || phase === "done") begin();
          else if (phase === "early") nextRound();
          else handleTap();
        }}
        className={`${boxStyle[phase]} h-40 rounded-xl text-white text-lg font-semibold select-none`}
      >
        {boxText[phase]}
      </button>

      {times.length > 0 && (
        <p className="text-sm text-gray-400">
          Round times: {times.map((t) => `${t} ms`).join(", ")}
        </p>
      )}

      {result && (
        <p
          className={
            result.passed
              ? "font-medium text-green-400"
              : "font-medium text-red-400"
          }
        >
          {result.passed
            ? `Fit to drive. Average ${result.avg} ms.`
            : `Not fit. Average ${result.avg} ms. Please take a break.`}
        </p>
      )}
      {message && <p className="text-red-400 text-sm">{message}</p>}
    </section>
  );
}