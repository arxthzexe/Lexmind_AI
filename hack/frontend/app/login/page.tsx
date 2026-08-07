"use client";

import { useState } from "react";
import { Card } from "@/components/Card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("lexmind_token", data.access_token);
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <Card title="Sign in to LexMind AI">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Sign in
          </button>
        </form>
      </Card>
    </div>
  );
}
