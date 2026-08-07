import { Card } from "@/components/Card";

export default function Reports() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reports</h1>
      <Card title="Recent Reports">
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">Vendor NDA</span> — Executive Summary ·{" "}
            <span className="text-gray-500">confidence 0.92</span>
          </li>
          <li>
            <span className="font-medium">Services Agreement</span> — Risk Report ·{" "}
            <span className="text-gray-500">confidence 0.85</span>
          </li>
          <li>
            <span className="font-medium">Lease</span> — Compliance Report ·{" "}
            <span className="text-gray-500">confidence 0.88</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
