'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShieldWarning, CheckCircle, ClockCounterClockwise, Plus, DownloadSimple, Eye } from '@phosphor-icons/react';

const mockReports = [
  { id: 1, title: 'Q3 2026 Executive Summary', date: 'Oct 15, 2026', type: 'Executive', status: 'Ready', contract: 'All MSAs' },
  { id: 2, title: 'Vendor Liability Risk Profile', date: 'Oct 12, 2026', type: 'Risk', status: 'Ready', contract: 'TechCorp Vendor' },
  { id: 3, title: 'GDPR Compliance Audit', date: 'Oct 10, 2026', type: 'Compliance', status: 'Processing', contract: 'Global Data DPA' },
  { id: 4, title: 'Q2 Audit Trail Review', date: 'Jul 20, 2026', type: 'Audit', status: 'Ready', contract: 'Alpha System' },
  { id: 5, title: 'SOC 2 Gap Analysis', date: 'Sep 05, 2026', type: 'Compliance', status: 'Draft', contract: 'Cloud Hosting SLA' },
  { id: 6, title: 'Annual Renewals Risk Report', date: 'Aug 30, 2026', type: 'Risk', status: 'Ready', contract: 'Multiple' },
];

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'Executive': return <FileText weight="fill" size={24} className="text-blue-500" />;
    case 'Risk': return <ShieldWarning weight="fill" size={24} className="text-crimson" />;
    case 'Compliance': return <CheckCircle weight="fill" size={24} className="text-emerald-500" />;
    case 'Audit': return <ClockCounterClockwise weight="fill" size={24} className="text-purple-500" />;
    default: return <FileText weight="fill" size={24} className="text-charcoal" />;
  }
};

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'Ready': return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold uppercase rounded">Ready</span>;
    case 'Processing': return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-700 text-[10px] font-bold uppercase rounded animate-pulse">Processing</span>;
    case 'Draft': return <span className="px-2 py-0.5 bg-charcoal/10 text-charcoal/70 text-[10px] font-bold uppercase rounded">Draft</span>;
    default: return null;
  }
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal">Reports</h1>
          <p className="text-charcoal/70 mt-1">Generated analytics, audits, and compliance exports</p>
        </div>
        <button className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-charcoal/90 transition-colors">
          <Plus weight="bold" /> Generate New
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockReports.map((report, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            key={report.id}
            className="bg-white border border-charcoal/5 shadow-sm hover:shadow-md transition-all rounded-xl p-5 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent group-hover:from-charcoal/5 group-hover:to-charcoal/10 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-charcoal/5 rounded-lg">
                {getTypeIcon(report.type)}
              </div>
              {getStatusBadge(report.status)}
            </div>
            
            <h3 className="font-bold text-charcoal text-lg mb-1">{report.title}</h3>
            <p className="text-xs text-charcoal/50 mb-4 font-mono">{report.date} &bull; {report.contract}</p>
            
            <div className="mt-auto pt-4 border-t border-charcoal/5 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal text-sm font-medium rounded-lg transition-colors">
                <Eye weight="bold" /> View
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-charcoal/10 hover:bg-charcoal/5 text-charcoal text-sm font-medium rounded-lg transition-colors disabled:opacity-50" disabled={report.status !== 'Ready'}>
                <DownloadSimple weight="bold" /> PDF
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
