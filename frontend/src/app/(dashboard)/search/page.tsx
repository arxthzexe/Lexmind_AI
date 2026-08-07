'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass, Graph, FileText, ShieldWarning } from '@phosphor-icons/react';

const mockResults = [
  { id: 1, title: 'Payment Terms Clause', contract: 'TechCorp Master Services Agreement', type: 'Clause', score: 98, snippet: 'The Client shall pay all undisputed invoices within <mark class="bg-amber-200/50 text-charcoal font-medium px-1 rounded">Net 30 days</mark> of receipt.', isGraph: true },
  { id: 2, title: 'Late Payment Penalty', contract: 'Global Logistics Vendor Contract', type: 'Risk', score: 85, snippet: 'Failure to remit payment within the <mark class="bg-amber-200/50 text-charcoal font-medium px-1 rounded">payment terms</mark> will incur a 1.5% monthly interest fee.', isGraph: true },
  { id: 3, title: 'Invoicing Schedule', contract: 'Alpha Software License', type: 'Obligation', score: 72, snippet: 'Vendor must issue invoices according to the agreed <mark class="bg-amber-200/50 text-charcoal font-medium px-1 rounded">payment terms</mark> schedule.', isGraph: false },
];

export default function SearchPage() {
  const [query, setQuery] = useState('payment terms');
  const [isGraphRAG, setIsGraphRAG] = useState(true);

  return (
    <div className="space-y-8 flex flex-col min-h-[calc(100vh-6rem)]">
      
      <div className="flex flex-col items-center pt-8">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal/40">
            <MagnifyingGlass size={24} weight="bold" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all contracts, clauses, and obligations..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-full shadow-sm text-lg outline-none focus:border-crimson focus:shadow-md transition-all text-charcoal font-medium"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {['All', 'Contracts', 'Clauses', 'Obligations', 'Risks', 'Regulations'].map((filter, i) => (
            <button key={filter} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === 0 ? 'bg-charcoal text-white' : 'bg-charcoal/5 text-charcoal/70 hover:bg-charcoal/10'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6 bg-white px-4 py-2 rounded-full border border-charcoal/5 shadow-sm">
          <span className={`text-sm font-medium ${!isGraphRAG ? 'text-charcoal' : 'text-charcoal/40'}`}>Keyword Search</span>
          <button 
            onClick={() => setIsGraphRAG(!isGraphRAG)}
            className="w-12 h-6 bg-charcoal/10 rounded-full relative flex items-center px-1"
          >
            <motion.div 
              layout
              className={`w-4 h-4 rounded-full ${isGraphRAG ? 'bg-crimson ml-auto' : 'bg-charcoal'}`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-1 ${isGraphRAG ? 'text-crimson' : 'text-charcoal/40'}`}>
            <Graph weight="bold" /> Semantic Search (GraphRAG)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-4">Results for "{query}"</h2>
          
          {mockResults.map((result, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={result.id} 
              className="bg-white p-5 rounded-xl border border-charcoal/5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-charcoal">{result.title}</h3>
                  <p className="text-xs text-charcoal/60 flex items-center gap-1 mt-1">
                    <FileText size={14} /> {result.contract}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {result.isGraph && isGraphRAG && (
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                      <Graph weight="bold" /> GraphRAG
                    </span>
                  )}
                  <span className="px-2 py-1 bg-charcoal/5 text-charcoal text-[10px] font-bold uppercase rounded">
                    {result.type}
                  </span>
                  <span className="text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">
                    {result.score}% Match
                  </span>
                </div>
              </div>
              <p className="text-sm text-charcoal/80 mt-3 font-body" dangerouslySetInnerHTML={{ __html: result.snippet }} />
            </motion.div>
          ))}
        </div>

        <div className="bg-ghost border border-charcoal/5 rounded-xl p-5 h-fit">
          <h2 className="text-sm font-bold text-charcoal flex items-center gap-2 mb-4 pb-3 border-b border-charcoal/5">
            <Graph weight="fill" className="text-crimson" /> Related Graph Nodes
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-charcoal/5">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600"><FileText weight="fill" /></div>
              <div>
                <div className="text-sm font-bold text-charcoal">MSA Agreement Framework</div>
                <div className="text-xs text-charcoal/50">Contract Template</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-charcoal/5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600"><ShieldWarning weight="fill" /></div>
              <div>
                <div className="text-sm font-bold text-charcoal">Revenue Recognition Risk</div>
                <div className="text-xs text-charcoal/50">Risk Node</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
