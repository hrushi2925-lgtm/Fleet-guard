"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"driver" | "manager">("driver");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });
      if (error) return setMessage(error.message);
      router.push(role === "manager" ? "/dashboard" : "/driver");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return setMessage(error.message);
      const userRole = data.user.user_metadata.role;
      router.push(userRole === "manager" ? "/dashboard" : "/driver");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold">
          {mode === "login" ? "Log in" : "Create account"}
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border bg-transparent px-4 py-3"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border bg-transparent px-4 py-3"
          required
        />

        {mode === "signup" && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "driver" | "manager")}
            className="rounded-lg border bg-transparent px-4 py-3"
          >
            <option value="driver" className="text-black">I'm a driver</option>
            <option value="manager" className="text-black">I'm a manager</option>
          </select>
        )}

        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 text-white">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>

        {message && <p className="text-red-400 text-sm">{message}</p>}

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-blue-500 underline text-sm"
        >
          {mode === "login"
            ? "No account? Sign up"
            : "Already have an account? Log in"}
        </button>
      </form>
    </main>
  );
}