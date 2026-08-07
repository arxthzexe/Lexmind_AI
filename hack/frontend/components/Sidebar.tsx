import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/contracts", label: "Contracts" },
  { href: "/clauses", label: "Clause Explorer" },
  { href: "/risk", label: "Risk Dashboard" },
  { href: "/compliance", label: "Compliance Dashboard" },
  { href: "/comparison", label: "Comparison" },
  { href: "/reports", label: "Reports" },
  { href: "/graph", label: "Graph Explorer" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 border-r border-gray-200 bg-white p-4">
      <div className="mb-6 text-lg font-semibold text-brand-700">LexMind AI</div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
