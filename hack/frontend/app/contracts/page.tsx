import { Card, StatCard } from "@/components/Card";

export default function Contracts() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Contracts</h1>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Total" value="12" />
        <StatCard label="Active" value="7" tone="good" />
        <StatCard label="Expiring soon" value="2" tone="warn" />
      </div>
      <Card title="Contract List">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Title</th>
              <th>Status</th>
              <th>Jurisdiction</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2">Vendor NDA</td>
              <td>Active</td>
              <td>New York</td>
              <td>1.0</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2">Services Agreement</td>
              <td>Review</td>
              <td>Delaware</td>
              <td>2.1</td>
            </tr>
            <tr>
              <td className="py-2">Lease</td>
              <td>Signed</td>
              <td>California</td>
              <td>1.0</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
