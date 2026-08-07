'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { contracts } from '@/lib/mock-data';
import { Shield, WarningOctagon, FileText, CheckCircle, ArrowRight } from '@phosphor-icons/react';

const POLICY_DATA = [
  { name: 'Data Protection (GDPR/CCPA)', score: 97, color: 'bg-emerald-500' },
  { name: 'Financial Regulations', score: 91, color: 'bg-emerald-400' },
  { name: 'Employment Law', score: 88, color: 'bg-amber-400' },
  { name: 'Industry Standards', score: 96, color: 'bg-emerald-500' },
  { name: 'Internal Policies', score: 93, color: 'bg-emerald-400' },
];

const VIOLATIONS = [
  { id: 1, severity: 'High', title: 'Data Processing Addendum Expired', regulation: 'GDPR Art. 28', contract: 'CTR-2022-0419' },
  { id: 2, severity: 'Medium', title: 'Missing Anti-Bribery Clause', regulation: 'FCPA', contract: 'CTR-2024-0941' },
  { id: 3, severity: 'High', title: 'Uncapped Liability Exposure', regulation: 'Internal Risk Policy v2', contract: 'CTR-2024-0912' },
];

const MISSING_CLAUSES = [
  { contract: 'Vendor Supplier Contract - Titan Infrastructure', type: 'Anti-Bribery (FCPA)', reqBy: 'Regulatory Compliance', severity: 'High' },
  { contract: 'Software Licensing Agreement', type: 'Data Breach Notification', reqBy: 'GDPR / CCPA', severity: 'Critical' },
  { contract: 'Commercial Lease', type: 'Force Majeure (Pandemic)', reqBy: 'Internal Policy', severity: 'Medium' },
];

export default function ComplianceDashboardPage() {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (94.2 / 100) * circumference;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-[100dvh]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Compliance Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor adherence to regulatory and internal policies.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl text-emerald-700 font-semibold text-sm">
          <Shield weight="fill" size={20} />
          94.2% Overall Score
        </div>
      </div>

      {/* Top Section: Large Gauge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50"></div>
        <h2 className="text-slate-500 font-semibold tracking-wide uppercase text-sm mb-6">Aggregate Compliance Health</h2>
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100" cy="100" r={radius}
              fill="transparent" stroke="#F1F5F9" strokeWidth="16"
            />
            <motion.circle
              cx="100" cy="100" r={radius}
              fill="transparent"
              stroke="#DC2626"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-bold text-slate-900 font-mono tracking-tighter">94.2<span className="text-2xl text-slate-400">%</span></span>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full text-sm">
              <CheckCircle weight="fill" />
              Compliant
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid Below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Policy Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
        >
          <h3 className="font-semibold text-slate-900 mb-6 text-lg">Policy Adherence Breakdown</h3>
          <div className="space-y-6">
            {POLICY_DATA.map((policy, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{policy.name}</span>
                  <span className="text-slate-900">{policy.score}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${policy.score}%` }}
                    transition={{ duration: 1, delay: 0.3 + (idx * 0.1) }}
                    className={`h-full rounded-full ${policy.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Violations */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900 text-lg">Active Violations</h3>
            <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {VIOLATIONS.length} Alerts
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {VIOLATIONS.map((violation) => (
              <div key={violation.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="mt-1">
                  <WarningOctagon size={24} weight="fill" className={violation.severity === 'High' ? 'text-red-500' : 'text-amber-500'} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm">{violation.title}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Shield size={14} /> {violation.regulation}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono"><FileText size={14} /> {violation.contract}</span>
                  </div>
                </div>
                <button className="self-center p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                  <ArrowRight />
                </button>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200">
            View All Violations
          </button>
        </motion.div>
      </div>

      {/* Bottom: Missing Clauses Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-amber-900 text-lg">Missing Clause Anomalies</h3>
            <p className="text-amber-700/70 text-sm mt-0.5">Critical omissions detected across active contracts.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-400 uppercase tracking-wider text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Contract Name</th>
                <th className="px-6 py-4 font-semibold">Missing Clause Type</th>
                <th className="px-6 py-4 font-semibold">Required By</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {MISSING_CLAUSES.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.contract}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-semibold">{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.reqBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                      item.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                      item.severity === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
