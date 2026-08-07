"use client";

import { useState } from "react";
import { Card } from "@/components/Card";

export default function GraphExplorer() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/graphrag/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (res.ok) {
      const data = await res.json();
      setAnswer(data.answer ?? "No answer");
    } else {
      setAnswer(`Failed: ${res.status}`);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Graph Explorer</h1>
      <Card title="Ask the Knowledge Graph">
        <form onSubmit={handleAsk} className="space-y-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What is the liability risk?"
            className="w-full rounded border border-gray-300 p-2 text-sm"
          />
          <button
            type="submit"
            className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Ask
          </button>
        </form>
        {answer ? <p className="mt-4 text-sm text-gray-700">{answer}</p> : null}
      </Card>
    </div>
  );
}
