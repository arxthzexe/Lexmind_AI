'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteContracts } from '@/lib/useSiteContracts';
import { 
  Kanban, CalendarBlank, ListDashes, Clock, CheckCircle, Warning, UserCircle 
} from '@phosphor-icons/react';

const COLUMNS = [
  { id: 'Pending', title: 'Pending', color: 'blue' },
  { id: 'In Progress', title: 'In Progress', color: 'amber' },
  { id: 'Completed', title: 'Completed', color: 'emerald' },
  { id: 'Overdue', title: 'Overdue', color: 'red' }
];

const getViewColor = (colorId: string) => {
  switch(colorId) {
    case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'red': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getBorderColor = (status: string) => {
  switch(status) {
    case 'Pending': return 'border-l-blue-500';
    case 'In Progress': return 'border-l-amber-500';
    case 'Completed': return 'border-l-emerald-500';
    case 'Overdue': return 'border-l-red-500';
    default: return 'border-l-slate-300';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Pending': return <Clock className="text-blue-500" />;
    case 'In Progress': return <Clock weight="fill" className="text-amber-500 animate-pulse" />;
    case 'Completed': return <CheckCircle weight="fill" className="text-emerald-500" />;
    case 'Overdue': return <Warning weight="fill" className="text-red-500" />;
    default: return null;
  }
};

const ObligationCard = ({ obligation }: { obligation: any }) => {
  // Determine if it should be overdue based on date for mock
  const isOverdue = new Date(obligation.dueDate) < new Date('2025-01-01') && obligation.status !== 'Completed';
  const effectiveStatus = isOverdue ? 'Overdue' : obligation.status;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 ${getBorderColor(effectiveStatus)} hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing flex flex-col gap-3`}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          {obligation.contractId}
        </span>
        <div title={effectiveStatus}>
          {getStatusIcon(effectiveStatus)}
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold text-slate-900 text-sm leading-tight mb-1">{obligation.action}</h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <UserCircle size={16} />
          <span className="font-medium truncate">{obligation.actor}</span>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center pt-3 border-t border-slate-100">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
          effectiveStatus === 'Overdue' ? 'bg-red-50 text-red-600' : 
          effectiveStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
          'bg-slate-50 text-slate-600'
        }`}>
          Due: {obligation.dueDate}
        </span>
        
        {obligation.penalty && (
          <span className="text-[10px] text-amber-600 flex items-center gap-1 max-w-[100px] truncate" title={`Penalty: ${obligation.penalty}`}>
            <Warning size={12} /> {obligation.penalty}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default function ObligationsDashboardPage() {
  const { obligations } = useSiteContracts();
  const [view, setView] = useState<'kanban' | 'timeline' | 'table'>('kanban');

  // Process obligations to override some statuses to 'Overdue' or 'In Progress' for better demo
  const processedObligations = obligations.map(ob => {
    let status = ob.status;
    if (ob.id === 'OB-101' || ob.id === 'OB-104') status = 'In Progress';
    if (new Date(ob.dueDate) < new Date('2025-01-01') && status !== 'Completed') status = 'Overdue';
    return { ...ob, status };
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-[100dvh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-3">
            Obligation Tracker
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {processedObligations.filter(o => o.status !== 'Completed').length} Pending
            </span>
          </h1>
          <p className="text-slate-500 mt-1">Manage and track contractual duties and milestones.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Kanban size={18} /> Kanban
          </button>
          <button 
            onClick={() => setView('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <CalendarBlank size={18} /> Timeline
          </button>
          <button 
            onClick={() => setView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <ListDashes size={18} /> Table
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start h-[calc(100vh-180px)] overflow-hidden">
          {COLUMNS.map((col, idx) => {
            const colObligations = processedObligations.filter(o => o.status === col.id);
            return (
              <div key={col.id} className="bg-slate-50/50 rounded-2xl border border-slate-200/60 h-full flex flex-col max-h-full">
                <div className="p-4 border-b border-slate-200/60 flex justify-between items-center bg-white/50 rounded-t-2xl">
                  <h3 className="font-semibold text-slate-800 text-sm">{col.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getViewColor(col.color)}`}>
                    {colObligations.length}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="space-y-4"
                  >
                    {colObligations.map(ob => (
                      <ObligationCard key={ob.id} obligation={ob} />
                    ))}
                    {colObligations.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                        <span className="text-slate-400 text-sm">No obligations</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center h-[500px]"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            {view === 'timeline' ? <CalendarBlank size={32} /> : <ListDashes size={32} />}
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 capitalize">{view} View Coming Soon</h2>
          <p className="text-slate-500 max-w-sm">
            We're putting the finishing touches on the {view} view. Check back soon for alternative ways to visualize your obligations.
          </p>
          <button 
            onClick={() => setView('kanban')}
            className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Return to Kanban
          </button>
        </motion.div>
      )}
    </div>
  );
}
