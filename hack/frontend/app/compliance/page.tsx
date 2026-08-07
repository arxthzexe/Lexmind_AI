import { Card, StatCard } from "@/components/Card";

const CHECKS = [
  { policy: "Data Protection", status: "Violation" },
  { policy: "Confidentiality", status: "Pass" },
  { policy: "Termination", status: "Pass" },
  { policy: "Governing Law", status: "Pass" },
  { policy: "Payment Terms", status: "Pass" },
];

export default function Compliance() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Compliance Dashboard</h1>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Compliance Score" value="87%" tone="good" />
        <StatCard label="Violations" value="1" tone="bad" />
        <StatCard label="Policies Checked" value="5" />
      </div>
      <Card title="Policy Checks">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Policy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {CHECKS.map((c) => (
              <tr key={c.policy} className="border-b border-gray-100">
                <td className="py-2">{c.policy}</td>
                <td className={c.status === "Violation" ? "text-red-600" : "text-green-600"}>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
