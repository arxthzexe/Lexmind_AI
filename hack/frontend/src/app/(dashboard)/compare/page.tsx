'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';
import { contracts as mockContracts } from '@/lib/mock-data';

export default function ComparePage() {
  const [allContracts, setAllContracts] = useState<any[]>(mockContracts);
  const [contractAId, setContractAId] = useState(mockContracts[0].id);
  const [contractBId, setContractBId] = useState(mockContracts[1].id);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('last_uploaded_contract') || localStorage.getItem('last_uploaded_contract');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.title) {
            const uploadedItem = {
              id: parsed.id || 'uploaded',
              title: parsed.title,
              type: 'Regulatory PDF',
              partyA: parsed.partyA || 'APCPDCL',
              partyB: parsed.partyB || 'AP-SPSU Contractor',
              status: parsed.status || 'Active',
              effectiveDate: parsed.effectiveDate || '2024-04-01',
              expirationDate: parsed.expirationDate || '2029-03-31',
              riskLevel: parsed.riskLevel || 'Medium',
              complianceScore: parsed.complianceScore || 88,
              clauses: parsed.clauses || [],
            };
            setAllContracts([uploadedItem, ...mockContracts.filter(c => c.id !== uploadedItem.id)]);
            setContractAId(uploadedItem.id);
          }
        } catch (e) {}
      }

      const params = new URLSearchParams(window.location.search);
      const urlA = params.get('contract_a');
      if (urlA) {
        setContractAId(urlA);
      }
    }
  }, []);

  const contractA = allContracts.find(c => c.id === contractAId) || allContracts[0];
  const contractB = allContracts.find(c => c.id === contractBId) || allContracts[1];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-bold text-charcoal">Contract Comparison</h1>
        <p className="text-charcoal/70">Compare two contracts side by side</p>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-charcoal/70">Contract A</label>
          <select 
            value={contractAId}
            onChange={(e) => setContractAId(e.target.value)}
            className="p-2 border border-charcoal/10 rounded-lg bg-white outline-none focus:border-crimson transition-colors"
          >
            {allContracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-charcoal/70">Contract B</label>
          <select 
            value={contractBId}
            onChange={(e) => setContractBId(e.target.value)}
            className="p-2 border border-charcoal/10 rounded-lg bg-white outline-none focus:border-crimson transition-colors"
          >
            {allContracts.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(30,30,45,0.04)] border border-charcoal/5 p-6">
        <div className="grid grid-cols-2 gap-8 divide-x divide-charcoal/10">
          
          <div className="space-y-6 pr-8">
            <div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{contractA.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-charcoal/5 rounded text-xs font-mono">
                  {contractA.title.includes('MSA') ? 'MSA' : contractA.title.includes('NDA') ? 'NDA' : 'SLA'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  contractA.riskLevel === 'High' ? 'bg-crimson/10 text-crimson' : 
                  contractA.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 
                  'bg-emerald-500/10 text-emerald-600'
                }`}>{contractA.riskLevel} Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-charcoal/5 rounded-full h-2">
                  <div className="bg-charcoal h-2 rounded-full" style={{ width: `${contractA.complianceScore}%` }}></div>
                </div>
                <span className="text-sm font-mono font-medium">{contractA.complianceScore}%</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-charcoal mb-4 border-b border-charcoal/5 pb-2">Key Clauses</h3>
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <CheckCircle weight="fill" />
                    <span className="font-medium text-sm">Matching Clause</span>
                  </div>
                  <p className="text-sm text-charcoal/80">Confidentiality obligations survive termination for a period of 5 years.</p>
                </div>
                <div className="p-3 bg-crimson/5 border border-crimson/20 rounded-lg">
                  <div className="flex items-center gap-2 text-crimson mb-1">
                    <XCircle weight="fill" />
                    <span className="font-medium text-sm">Different Clause</span>
                  </div>
                  <p className="text-sm text-charcoal/80">Payment terms are Net 30 days from invoice receipt.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pl-8">
            <div>
              <h2 className="text-xl font-bold text-charcoal mb-2">{contractB.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 bg-charcoal/5 rounded text-xs font-mono">
                  {contractB.title.includes('MSA') ? 'MSA' : contractB.title.includes('NDA') ? 'NDA' : 'SLA'}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  contractB.riskLevel === 'High' ? 'bg-crimson/10 text-crimson' : 
                  contractB.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 
                  'bg-emerald-500/10 text-emerald-600'
                }`}>{contractB.riskLevel} Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-charcoal/5 rounded-full h-2">
                  <div className="bg-charcoal h-2 rounded-full" style={{ width: `${contractB.complianceScore}%` }}></div>
                </div>
                <span className="text-sm font-mono font-medium">{contractB.complianceScore}%</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-charcoal mb-4 border-b border-charcoal/5 pb-2">Key Clauses</h3>
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <CheckCircle weight="fill" />
                    <span className="font-medium text-sm">Matching Clause</span>
                  </div>
                  <p className="text-sm text-charcoal/80">Confidentiality obligations survive termination for a period of 5 years.</p>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <WarningCircle weight="fill" />
                    <span className="font-medium text-sm">Different Clause</span>
                  </div>
                  <p className="text-sm text-charcoal/80">Payment terms are Net 60 days from invoice receipt.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
