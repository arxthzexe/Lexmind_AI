"use client";

import { useState } from "react";
import { Card } from "@/components/Card";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("title", file.name);
    const res = await fetch("/api/contracts/upload", { method: "POST", body: form });
    if (res.ok) {
      setStatus("Uploaded. Analysis queued.");
    } else {
      setStatus(`Upload failed: ${res.status}`);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Upload Contract</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.docx,.png,.jpg,.tiff"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          <button
            type="submit"
            className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Upload
          </button>
        </form>
        {status ? <p className="mt-4 text-sm text-gray-600">{status}</p> : null}
      </Card>
    </div>
  );
}
