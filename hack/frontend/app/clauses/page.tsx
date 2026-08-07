import { Card } from "@/components/Card";

const CLAUSES = [
  { type: "Payment", confidence: "0.92", clauses: 3 },
  { type: "Confidentiality", confidence: "0.88", clauses: 2 },
  { type: "Termination", confidence: "0.85", clauses: 1 },
  { type: "Liability", confidence: "0.79", clauses: 2 },
  { type: "Governing Law", confidence: "0.95", clauses: 1 },
];

export default function Clauses() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Clause Explorer</h1>
      <Card title="Detected Clause Types">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Type</th>
              <th>Confidence</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {CLAUSES.map((c) => (
              <tr key={c.type} className="border-b border-gray-100">
                <td className="py-2">{c.type}</td>
                <td>{c.confidence}</td>
                <td>{c.clauses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
