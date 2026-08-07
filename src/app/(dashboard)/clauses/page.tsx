'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContracts } from '@/lib/useSiteContracts';
import { CaretDown, ShieldCheck, FileText, MagnifyingGlass } from '@phosphor-icons/react';

const CLAUSE_TYPES = [
  'All',
  'Payment',
  'Confidentiality',
  'Termination',
  'Liability',
  'Intellectual Property',
  'Force Majeure',
  'Dispute Resolution',
  'Governing Law',
  'Indemnification',
  'Non-Compete',
  'Data Protection'
];

// Helper to get color based on clause type
const getClauseColor = (type: string) => {
  switch (type) {
    case 'Payment': return 'bg-emerald-100 text-emerald-800';
    case 'Confidentiality': return 'bg-purple-100 text-purple-800';
    case 'Termination': return 'bg-red-100 text-red-800';
    case 'Liability': return 'bg-orange-100 text-orange-800';
    case 'Intellectual Property': return 'bg-blue-100 text-blue-800';
    case 'Data Protection': return 'bg-teal-100 text-teal-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const ClauseCard = ({ clause, contracts }: { clause: any; contracts: any[] }) => {
  const [expanded, setExpanded] = useState(false);
  const contract = contracts.find((c) => c.id === clause.contractId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getClauseColor(clause.type)}`}>
          {clause.type}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-50 px-2 py-1 rounded-md text-slate-600 border border-slate-100">
          <ShieldCheck weight="fill" className={clause.confidence > 90 ? 'text-emerald-500' : 'text-amber-500'} />
          {clause.confidence}% Confidence
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <FileText size={14} />
          {contract?.title || clause.contractId}
        </div>
        <div className="text-slate-800 text-sm leading-relaxed">
          <span className={expanded ? '' : 'line-clamp-2'}>
            {clause.text}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-100">
        <span className="text-[10px] text-slate-400 font-mono">ID: {clause.id} • Region: Pg. 3, Para 2</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-crimson-600 text-xs font-medium flex items-center gap-1 hover:text-crimson-700 transition-colors"
        >
          {expanded ? 'Show Less' : 'Read Full'}
          <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
            <CaretDown weight="bold" />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
};

export default function ClauseExplorerPage() {
  const { clauses, contracts } = useSiteContracts();
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClauses = clauses.filter((c) => {
    const matchesType = selectedType === 'All' || c.type === selectedType;
    const matchesSearch = c.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-[100dvh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 font-display">
            Clause Explorer
            <span className="bg-crimson-100 text-crimson-800 text-sm font-semibold px-3 py-1 rounded-full">
              {clauses.length} Total
            </span>
          </h1>
          <p className="text-slate-500 mt-1">Discover, filter, and analyze extracted contract clauses.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search clauses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500/20 focus:border-crimson-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Clause Types</h3>
          <div className="flex flex-wrap md:flex-col gap-2">
            {CLAUSE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-left transition-all ${
                  selectedType === type
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Clause Grid */}
        <div className="flex-1">
          {filteredClauses.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <AnimatePresence>
                {filteredClauses.map((clause) => (
                  <ClauseCard key={clause.id} clause={clause} contracts={contracts} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No clauses found</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                We couldn't find any clauses matching your current filters. Try adjusting them.
              </p>
              <button 
                onClick={() => { setSelectedType('All'); setSearchQuery(''); }}
                className="mt-4 text-crimson-600 text-sm font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
