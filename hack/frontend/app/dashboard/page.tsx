import { Card, StatCard } from "@/components/Card";

export default function Dashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Contracts" value="12" />
        <StatCard label="Open Obligations" value="34" />
        <StatCard label="High Risk" value="3" tone="bad" />
        <StatCard label="Compliance Score" value="87%" tone="good" />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card title="Recent Contracts">
          <ul className="space-y-2 text-sm">
            <li>Vendor NDA — active</li>
            <li>Services Agreement — review</li>
            <li>Lease — signed</li>
          </ul>
        </Card>
        <Card title="AI Activity">
          <p className="text-sm text-gray-600">Multi-agent review completed for 3 contracts this week.</p>
        </Card>
      </div>
    </div>
  );
}
