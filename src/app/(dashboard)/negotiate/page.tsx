'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagicWand, ShieldWarning, Check, X } from '@phosphor-icons/react';
import { contracts as mockContracts } from '@/lib/mock-data';

export default function NegotiatePage() {
  const [selectedId, setSelectedId] = useState(mockContracts[0].id);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-3xl font-display font-bold text-charcoal">Negotiation Copilot</h1>
        <span className="px-3 py-1 bg-gradient-to-r from-crimson to-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <MagicWand weight="bold" /> AI-Powered
        </span>
      </header>

      <div className="w-64">
        <select 
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full p-2 border border-charcoal/10 rounded-lg bg-white outline-none focus:border-crimson transition-colors text-sm"
        >
          {mockContracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[calc(100vh-14rem)]">
        {/* Left Panel */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-[0_4px_24px_rgba(30,30,45,0.04)] border border-charcoal/5 p-6 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3">Original Contract View</h2>
          
          <div className="space-y-6">
            <div className="text-charcoal/80 leading-relaxed font-body">
              <h3 className="font-bold text-charcoal mb-2">9. Limitation of Liability</h3>
              <p>
                In no event shall either party be liable for any indirect, incidental, special, or consequential damages.
                <span className="bg-crimson/10 text-crimson font-medium px-1 mx-1 rounded border border-crimson/20">The total aggregate liability of the Vendor shall not exceed the amount paid in the preceding one (1) month.</span>
                This limitation applies regardless of the form of action.
              </p>
            </div>
            
            <div className="text-charcoal/80 leading-relaxed font-body">
              <h3 className="font-bold text-charcoal mb-2">10. Indemnification</h3>
              <p>
                Vendor agrees to indemnify and hold harmless the Client against <span className="bg-amber-500/20 text-amber-800 font-medium px-1 mx-1 rounded border border-amber-500/30">any and all claims, damages, or expenses arising from the use of the services</span>, irrespective of fault.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2 bg-ghost rounded-xl border border-charcoal/5 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-charcoal font-bold text-lg mb-2">
            <MagicWand weight="fill" className="text-crimson" />
            AI Suggestions Panel
          </div>

          <div className="space-y-4 flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-charcoal/5">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-sm text-charcoal">Liability Cap Risk</span>
                <span className="px-2 py-1 bg-crimson/10 text-crimson text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                  <ShieldWarning weight="bold" /> High
                </span>
              </div>
              <div className="text-sm text-charcoal/60 line-through mb-2">
                ...shall not exceed the amount paid in the preceding one (1) month.
              </div>
              <div className="text-sm text-emerald-700 bg-emerald-500/10 p-2 rounded mb-3 border border-emerald-500/20">
                ...shall not exceed the total fees paid by Client to Vendor under this Agreement in the twelve (12) months preceding the claim.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal/50 font-medium">Reduces risk by 80%</span>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-charcoal/5 hover:bg-charcoal/10 rounded-md text-charcoal transition-colors"><X weight="bold" /></button>
                  <button className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-md text-emerald-600 transition-colors"><Check weight="bold" /></button>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-charcoal/5">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-sm text-charcoal">Broad Indemnification</span>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded flex items-center gap-1 uppercase">
                  <ShieldWarning weight="bold" /> Medium
                </span>
              </div>
              <div className="text-sm text-charcoal/60 line-through mb-2">
                ...any and all claims, damages, or expenses arising from the use of the services...
              </div>
              <div className="text-sm text-emerald-700 bg-emerald-500/10 p-2 rounded mb-3 border border-emerald-500/20">
                ...claims arising directly from Vendor's gross negligence or willful misconduct in providing the services...
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-charcoal/50 font-medium">Reduces risk by 60%</span>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-charcoal/5 hover:bg-charcoal/10 rounded-md text-charcoal transition-colors"><X weight="bold" /></button>
                  <button className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-md text-emerald-600 transition-colors"><Check weight="bold" /></button>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-charcoal text-white rounded-lg font-bold text-sm hover:bg-charcoal/90 transition-colors">
            Generate Redlined Report
          </button>
        </div>
      </div>
    </div>
  );
}
