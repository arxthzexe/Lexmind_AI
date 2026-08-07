"use client";

import { useState } from "react";
import { Card } from "@/components/Card";

export default function Comparison() {
  const [contractA, setContractA] = useState("");
  const [contractB, setContractB] = useState("");
  const [result, setResult] = useState<string>("");

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/contracts/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contract_a: contractA, contract_b: contractB }),
    });
    if (res.ok) setResult("Comparison complete. See deltas below.");
    else setResult(`Failed: ${res.status}`);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Contract Comparison</h1>
      <Card>
        <form onSubmit={handleCompare} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contract A</label>
            <textarea
              value={contractA}
              onChange={(e) => setContractA(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contract B</label>
            <textarea
              value={contractB}
              onChange={(e) => setContractB(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Compare
          </button>
        </form>
        {result ? <p className="mt-4 text-sm text-gray-600">{result}</p> : null}
      </Card>
    </div>
  );
}
