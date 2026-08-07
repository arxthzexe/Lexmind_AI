import { Card, StatCard } from "@/components/Card";

const RISKS = [
  { category: "Legal", severity: "High", description: "Unlimited liability clause" },
  { category: "Financial", severity: "Medium", description: "Late payment penalty" },
  { category: "Compliance", severity: "Critical", description: "No data protection clause" },
  { category: "Operational", severity: "Low", description: "SLA missing" },
];

export default function Risk() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Risk Dashboard</h1>
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Critical" value="1" tone="bad" />
        <StatCard label="High" value="1" tone="warn" />
        <StatCard label="Medium" value="1" tone="warn" />
        <StatCard label="Low" value="1" tone="good" />
      </div>
      <Card title="Identified Risks">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Category</th>
              <th>Severity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {RISKS.map((r) => (
              <tr key={r.description} className="border-b border-gray-100">
                <td className="py-2">{r.category}</td>
                <td>{r.severity}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
