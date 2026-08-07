export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      {title ? <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3> : null}
      {children}
    </div>
  );
}

export function StatCard({ label, value, tone = "default" }: {
  label: string;
  value: string | number;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const tones = {
    default: "text-gray-900",
    good: "text-green-600",
    warn: "text-amber-600",
    bad: "text-red-600",
  };
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
