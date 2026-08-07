'use client';

import React from 'react';
import { Funnel, Calendar, Robot, Info } from '@phosphor-icons/react';

const mockAudit = Array.from({ length: 12 }).map((_, i) => ({
  id: `AL-${1000 + i}`,
  timestamp: `2026-08-07T${10 + (i%5)}:${15 + (i*13)%60}:${10 + i}Z`,
  agent: i % 3 === 0 ? 'Review Agent' : i % 3 === 1 ? 'Extraction Agent' : 'Risk Agent',
  action: i % 2 === 0 ? 'Identified High Risk Clause' : 'Extracted Payment Terms',
  contract: 'TechCorp MSA 2026',
  confidence: 85 + (i % 15),
  details: i % 2 === 0 ? 'Clause 9.1 limits liability to $0, conflicting with standard playbook.' : 'Net 45 days identified in Section 4.2'
}));

export default function AuditPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <header>
        <h1 className="text-3xl font-display font-bold text-charcoal">Audit Log</h1>
        <p className="text-charcoal/70 mt-1">Decision Trace & AI Reasoning</p>
      </header>

      <div className="flex gap-4 p-4 bg-white border border-charcoal/10 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-ghost border border-charcoal/10 rounded-lg text-sm text-charcoal/70">
          <Calendar weight="bold" /> Last 24 Hours
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-ghost border border-charcoal/10 rounded-lg text-sm text-charcoal/70">
          <Robot weight="bold" /> All Agents
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-ghost border border-charcoal/10 rounded-lg text-sm text-charcoal/70 ml-auto cursor-pointer hover:bg-charcoal/5">
          <Funnel weight="bold" /> Filter
        </div>
      </div>

      <div className="bg-white border border-charcoal/10 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ghost border-b border-charcoal/10 text-xs uppercase tracking-wider text-charcoal/50 font-bold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Action</th>
                <th className="p-4">Contract</th>
                <th className="p-4">Confidence</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {mockAudit.map((log) => (
                <tr key={log.id} className="hover:bg-ghost/50 transition-colors group">
                  <td className="p-4 font-mono text-xs text-charcoal/60 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-charcoal">
                      <div className={`w-2 h-2 rounded-full ${log.agent === 'Risk Agent' ? 'bg-crimson' : log.agent === 'Extraction Agent' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                      {log.agent}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-charcoal">{log.action}</td>
                  <td className="p-4 text-sm text-charcoal/70">{log.contract}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                        <div className={`h-full ${log.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${log.confidence}%` }} />
                      </div>
                      <span className="text-xs font-mono">{log.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-charcoal/40 hover:text-crimson hover:bg-crimson/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                      <Info size={18} weight="bold" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
