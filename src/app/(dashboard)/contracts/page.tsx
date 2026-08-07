"use client";

import { useState } from "react";
import { 
  Funnel, 
  MagnifyingGlass, 
  SquaresFour, 
  ListDashes, 
  Plus, 
  CalendarBlank, 
  ShieldCheck, 
  ArrowRight 
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { contracts } from "@/lib/mock-data";

import { useEffect } from "react";

type ViewMode = "grid" | "list";

export default function ContractsPage() {
  const [allContracts, setAllContracts] = useState<any[]>(contracts);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("last_uploaded_contract") || localStorage.getItem("last_uploaded_contract");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.title) {
            const uploadedItem = {
              id: parsed.id || "uploaded",
              title: parsed.title,
              type: "Regulatory PDF",
              partyA: parsed.partyA || "APCPDCL",
              partyB: parsed.partyB || "AP-SPSU Contractor",
              status: parsed.status || "Active",
              effectiveDate: parsed.effectiveDate || "2024-04-01",
              expirationDate: parsed.expirationDate || "2029-03-31",
              riskLevel: parsed.riskLevel || "Medium",
              complianceScore: parsed.complianceScore || 88,
            };
            setAllContracts([uploadedItem, ...contracts.filter((c) => c.id !== uploadedItem.id)]);
          }
        } catch (e) {}
      }
    }
  }, []);

  const filteredContracts = allContracts.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.partyB.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    const matchesRisk = riskFilter === "All" || c.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch(risk.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#1E1E2D] font-display">Contracts</h1>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
              {allContracts.length} Total
            </span>
          </div>
          <Link href="/upload" className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#DC2626]/90 transition-colors shadow-sm self-start md:self-auto">
            <Plus weight="bold" />
            Upload New
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search contracts..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="flex items-center gap-2 min-w-max">
                <Funnel className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <select 
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Review">Under Review</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="flex items-center gap-2 min-w-max ml-4">
                <span className="text-sm font-medium text-gray-600">Risk:</span>
                <select 
                  className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                >
                  <option value="All">All Risks</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shrink-0">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1E1E2D]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SquaresFour size={20} weight={viewMode === 'grid' ? "fill" : "regular"} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1E1E2D]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListDashes size={20} weight={viewMode === 'list' ? "fill" : "regular"} />
            </button>
          </div>
        </div>

        {/* Content */}
        {filteredContracts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1E1E2D]">No contracts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
          >
            {viewMode === "grid" ? (
              // GRID VIEW
              filteredContracts.map((contract) => (
                <motion.div key={contract.id} variants={item}>
                  <Link href={`/contracts/${contract.id}`} className="block h-full">
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#DC2626]/30 transition-all duration-300 h-full flex flex-col group">
                      
                      {/* Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                          {contract.status}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getRiskColor(contract.riskLevel)}`}>
                          Risk: {contract.riskLevel}
                        </span>
                      </div>

                      {/* Title & Parties */}
                      <h3 className="text-lg font-bold text-[#1E1E2D] mb-1 line-clamp-2 font-display group-hover:text-[#DC2626] transition-colors">
                        {contract.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 flex-grow">
                        {contract.partyA} • {contract.partyB}
                      </p>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100">
                        <div>
                          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <CalendarBlank size={14} /> Effective
                          </div>
                          <div className="text-sm font-medium text-[#1E1E2D] font-mono">
                            {new Date(contract.effectiveDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <CalendarBlank size={14} /> Expiry
                          </div>
                          <div className="text-sm font-medium text-[#1E1E2D] font-mono">
                            {new Date(contract.expirationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Compliance Score */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <ShieldCheck size={14} /> Compliance Score
                          </span>
                          <span className="text-xs font-bold text-[#1E1E2D]">{contract.complianceScore}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${contract.complianceScore >= 90 ? 'bg-green-500' : contract.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${contract.complianceScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-auto flex items-center text-sm font-semibold text-[#DC2626] group-hover:gap-2 transition-all">
                        View Details <ArrowRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // LIST VIEW
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Contract Name & Parties</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Risk Level</th>
                        <th className="px-6 py-4">Compliance</th>
                        <th className="px-6 py-4">Expiry Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredContracts.map((contract) => (
                        <motion.tr key={contract.id} variants={item} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <Link href={`/contracts/${contract.id}`} className="block">
                              <div className="font-semibold text-[#1E1E2D] mb-1 group-hover:text-[#DC2626] transition-colors">{contract.title}</div>
                              <div className="text-xs text-gray-500">{contract.partyA} • {contract.partyB}</div>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                              {contract.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRiskColor(contract.riskLevel)}`}>
                              {contract.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#1E1E2D] w-6">{contract.complianceScore}</span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${contract.complianceScore >= 90 ? 'bg-green-500' : contract.complianceScore >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                  style={{ width: `${contract.complianceScore}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-[#1E1E2D] font-mono">
                              {new Date(contract.expirationDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link 
                              href={`/contracts/${contract.id}`}
                              className="text-[#DC2626] font-medium text-sm hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
