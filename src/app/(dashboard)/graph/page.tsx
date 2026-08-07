'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Graph, MagnifyingGlassPlus, MagnifyingGlassMinus, Funnel, Database } from '@phosphor-icons/react';

export default function GraphPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal flex items-center gap-3">
            Knowledge Graph Explorer
            <span className="px-2 py-1 bg-charcoal/10 text-charcoal text-xs rounded-full font-mono font-medium tracking-widest flex items-center gap-1">
              <Database size={12} /> 1,204 NODES
            </span>
          </h1>
        </div>
      </header>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Graph Area */}
        <div className="flex-1 bg-white border border-charcoal/10 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
          <div className="absolute top-4 left-4 flex gap-2">
            <button className="p-2 bg-white shadow-sm border border-charcoal/10 rounded-md text-charcoal hover:bg-ghost"><MagnifyingGlassPlus /></button>
            <button className="p-2 bg-white shadow-sm border border-charcoal/10 rounded-md text-charcoal hover:bg-ghost"><MagnifyingGlassMinus /></button>
          </div>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-charcoal/10 shadow-sm flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Contract</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div> Clause</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Party</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div> Risk</div>
          </div>

          {/* SVG Mock Graph */}
          <svg className="w-full h-full" viewBox="0 0 800 600">
            <g stroke="#1E1E2D" strokeOpacity="0.15" strokeWidth="2">
              <line x1="400" y1="300" x2="250" y2="200" />
              <line x1="400" y1="300" x2="550" y2="220" />
              <line x1="400" y1="300" x2="450" y2="450" />
              <line x1="400" y1="300" x2="280" y2="420" />
              
              <line x1="250" y1="200" x2="150" y2="150" />
              <line x1="250" y1="200" x2="200" y2="280" />
              
              <line x1="550" y1="220" x2="650" y2="180" />
              <line x1="550" y1="220" x2="600" y2="300" />
            </g>

            <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <circle cx="400" cy="300" r="24" fill="#3b82f6" />
              <text x="400" y="340" textAnchor="middle" fontSize="12" fill="#1E1E2D" fontWeight="bold">TechCorp MSA</text>
            </motion.g>

            <motion.g animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}>
              <circle cx="250" cy="200" r="16" fill="#22c55e" />
              <text x="250" y="230" textAnchor="middle" fontSize="10" fill="#1E1E2D">Liability Clause</text>
            </motion.g>

            <motion.g animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 1 }}>
              <circle cx="550" cy="220" r="16" fill="#22c55e" />
              <text x="550" y="250" textAnchor="middle" fontSize="10" fill="#1E1E2D">Payment Terms</text>
            </motion.g>

            <motion.g animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.5 }}>
              <circle cx="450" cy="450" r="18" fill="#a855f7" />
              <text x="450" y="485" textAnchor="middle" fontSize="10" fill="#1E1E2D">TechCorp Inc.</text>
            </motion.g>

            <motion.g animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.2 }}>
              <circle cx="280" cy="420" r="18" fill="#a855f7" />
              <text x="280" y="455" textAnchor="middle" fontSize="10" fill="#1E1E2D">Global Logistics</text>
            </motion.g>

            <circle cx="150" cy="150" r="12" fill="#ef4444" />
            <text x="150" y="175" textAnchor="middle" fontSize="9" fill="#1E1E2D">Cap Risk</text>
            
            <circle cx="200" cy="280" r="12" fill="#14b8a6" />
            <circle cx="650" cy="180" r="12" fill="#f59e0b" />
            <circle cx="600" cy="300" r="12" fill="#14b8a6" />
          </svg>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border border-charcoal/10 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold text-charcoal/50 uppercase tracking-wider">Selected Node</span>
          </div>
          
          <h2 className="text-xl font-bold text-charcoal mb-1">TechCorp MSA</h2>
          <p className="text-sm text-charcoal/60 mb-6">Master Services Agreement</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-charcoal/50 uppercase mb-2">Properties</h3>
              <div className="bg-ghost p-3 rounded-lg space-y-2 text-sm border border-charcoal/5">
                <div className="flex justify-between"><span className="text-charcoal/60">Status</span><span className="font-medium text-emerald-600">Active</span></div>
                <div className="flex justify-between"><span className="text-charcoal/60">Effective Date</span><span className="font-mono">2024-01-15</span></div>
                <div className="flex justify-between"><span className="text-charcoal/60">Jurisdiction</span><span className="font-medium">Delaware, USA</span></div>
                <div className="flex justify-between"><span className="text-charcoal/60">Risk Score</span><span className="font-mono text-amber-600">42/100</span></div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-charcoal/50 uppercase mb-2">Connected Nodes (4)</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-white border border-charcoal/10 rounded-md text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div> TechCorp Inc.
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-charcoal/10 rounded-md text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div> Global Logistics
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-charcoal/10 rounded-md text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Liability Clause
                </div>
                <div className="flex items-center gap-2 p-2 bg-white border border-charcoal/10 rounded-md text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Payment Terms
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
