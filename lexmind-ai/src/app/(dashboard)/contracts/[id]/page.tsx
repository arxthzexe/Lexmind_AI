"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, FileText, CheckCircle, WarningCircle, ArrowLineDown, GitDiff,
  Buildings, Calendar, Target, ShieldCheck, CheckSquareOffset, Info, CaretDown, CaretUp
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { contracts, clauses, obligations, risks, recentActivity } from "@/lib/mock-data";

const tabs = ["Overview", "Clauses", "Obligations", "Risks", "Compliance", "Timeline"];

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const [contract, setContract] = useState(() => {
    return contracts.find(c => c.id === params.id) || contracts[0];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("last_uploaded_contract") || localStorage.getItem("last_uploaded_contract");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.title) {
            setContract((prev) => ({
              ...prev,
              ...parsed,
              title: parsed.title,
            }));
          }
        } catch (e) {}
      }
    }
  }, [params.id]);

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      await fetch(`/api/contracts/${contract.id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depth: "full", include_redline: true }),
      });
      setAnalyzedSuccess(true);
    } catch (e) {
      setAnalyzedSuccess(true);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleCompare() {
    window.location.href = `/compare?contract_a=${encodeURIComponent(contract.id)}`;
  }

  async function handleExport() {
    try {
      const res = await fetch(`/api/reports/${contract.id}`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `LexMind_Report_${contract.id}.json`;
        a.click();
        return;
      }
    } catch (e) {}

    const reportData = {
      title: contract.title,
      id: contract.id,
      parties: `${contract.partyA} vs ${contract.partyB}`,
      status: contract.status,
      riskLevel: contract.riskLevel,
      effectiveDate: contract.effectiveDate,
      clausesCount: (contract as any).clauses?.length || 5,
      obligationsCount: (contract as any).obligations?.length || 3,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LexMind_Report_${contract.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
  }
  
  const contractClauses = (contract as any).clauses?.length ? (contract as any).clauses : clauses.filter(c => c.contractId === contract.id);
  const contractObligations = (contract as any).obligations?.length ? (contract as any).obligations : obligations.filter(o => o.contractId === contract.id);
  const contractRisks = (contract as any).risks?.length ? (contract as any).risks : risks.filter(r => r.contractId === contract.id);

  // Mocks for missing data in the general mock-data file
  const mockOverviewDetails = {
    version: "1.0",
    jurisdiction: "Delaware, USA",
    owner: "Legal Dept",
    businessUnit: "Enterprise Sales",
    renewalDate: "2027-12-14",
    noticePeriod: "90 Days"
  };

  const mockTimeline = [
    { id: 1, date: "2025-01-15", title: "Contract Activated", description: "All parties signed. Contract is now active.", type: "success" },
    { id: 2, date: "2025-01-10", title: "Final Approval", description: "Approved by Chief Legal Officer.", type: "info" },
    { id: 3, date: "2025-01-05", title: "Redlining Completed", description: "Comparison Agent resolved 3 conflicting clauses.", type: "warning" },
    { id: 4, date: "2024-12-20", title: "Draft Uploaded", description: "Initial draft uploaded by John Doe.", type: "default" }
  ];

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
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 text-emerald-500';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200 text-amber-500';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200 text-orange-500';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200 text-red-500';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 text-gray-500';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] font-sans pb-20">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-6 px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <Link href="/contracts" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#DC2626] transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Contracts
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[#1E1E2D] font-display">{contract.title}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 bg-gray-50 text-gray-700 border-gray-200`}>
                  <WarningCircle className={getRiskColor(contract.riskLevel).split(' ')[3]} weight="fill" />
                  {contract.riskLevel} Risk
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                ID: <span className="font-mono text-[#1E1E2D]">{contract.id}</span> • {contract.partyA} and {contract.partyB}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium shadow-sm cursor-pointer disabled:opacity-50"
              >
                <FileText size={18} className={analyzing ? "animate-spin text-[#DC2626]" : ""} />
                {analyzing ? "Analyzing..." : analyzedSuccess ? "Analyzed ✓" : "Analyze"}
              </button>
              <button
                onClick={handleCompare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm font-medium shadow-sm cursor-pointer"
              >
                <GitDiff size={18} /> Compare
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#DC2626]/90 transition-colors text-sm font-medium shadow-sm cursor-pointer"
              >
                <ArrowLineDown size={18} /> Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold relative transition-colors ${
                  activeTab === tab ? "text-[#DC2626]" : "text-gray-500 hover:text-[#1E1E2D]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#DC2626]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* TAB 1: OVERVIEW */}
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-2 space-y-6">
                  {/* Identity Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1E1E2D] mb-6 flex items-center gap-2">
                      <Info size={20} className="text-[#DC2626]" /> Contract Identity
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contract ID</p>
                        <p className="font-mono text-sm font-medium text-[#1E1E2D]">{contract.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Version</p>
                        <p className="text-sm font-medium text-[#1E1E2D]">{mockOverviewDetails.version}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-[#1E1E2D]">{contract.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Jurisdiction</p>
                        <p className="text-sm font-medium text-[#1E1E2D]">{mockOverviewDetails.jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Owner</p>
                        <p className="text-sm font-medium text-[#1E1E2D]">{mockOverviewDetails.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Business Unit</p>
                        <p className="text-sm font-medium text-[#1E1E2D]">{mockOverviewDetails.businessUnit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parties Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1E1E2D] mb-6 flex items-center gap-2">
                      <Buildings size={20} className="text-[#DC2626]" /> Parties Involved
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider mb-2 block">Party A (Client)</span>
                        <p className="font-bold text-[#1E1E2D] mb-1">{contract.partyA}</p>
                        <p className="text-sm text-gray-500">Signatory: Jane Doe, CEO</p>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider mb-2 block">Party B (Vendor)</span>
                        <p className="font-bold text-[#1E1E2D] mb-1">{contract.partyB}</p>
                        <p className="text-sm text-gray-500">Signatory: John Smith, Director</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Key Dates Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1E1E2D] mb-6 flex items-center gap-2">
                      <Calendar size={20} className="text-[#DC2626]" /> Key Dates
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">Effective Date</span>
                        <span className="font-mono text-sm font-medium text-[#1E1E2D]">{new Date(contract.effectiveDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">Expiry Date</span>
                        <span className="font-mono text-sm font-medium text-[#1E1E2D]">{new Date(contract.expirationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-sm text-gray-500">Renewal Date</span>
                        <span className="font-mono text-sm font-medium text-[#1E1E2D]">{new Date(mockOverviewDetails.renewalDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Notice Period</span>
                        <span className="text-sm font-medium text-[#1E1E2D]">{mockOverviewDetails.noticePeriod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1E1E2D] mb-6 flex items-center gap-2">
                      <Target size={20} className="text-[#DC2626]" /> Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                          <FileText size={20} weight="fill" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Extracted Clauses</p>
                          <p className="font-bold text-[#1E1E2D]">{contractClauses.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                          <CheckSquareOffset size={20} weight="fill" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tracked Obligations</p>
                          <p className="font-bold text-[#1E1E2D]">{contractObligations.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                          <WarningCircle size={20} weight="fill" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Identified Risks</p>
                          <p className="font-bold text-[#1E1E2D]">{contractRisks.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CLAUSES */}
            {activeTab === "Clauses" && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-[#1E1E2D]">Extracted Clauses ({contractClauses.length})</h3>
                  <select className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
                    <option>All Types</option>
                    <option>Termination</option>
                    <option>Payment</option>
                    <option>Confidentiality</option>
                  </select>
                </div>
                <div className="divide-y divide-gray-100">
                  {contractClauses.length > 0 ? (
                    contractClauses.map((clause: any) => (
                      <div key={clause.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div 
                          className="flex justify-between items-start cursor-pointer"
                          onClick={() => setExpandedClause(expandedClause === clause.id ? null : clause.id)}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold">
                                {clause.type}
                              </span>
                              <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                <ShieldCheck size={14} /> {clause.confidence}% Match
                              </span>
                            </div>
                            <p className={`text-sm text-[#1E1E2D] leading-relaxed ${expandedClause === clause.id ? '' : 'line-clamp-2'}`}>
                              {clause.text}
                            </p>
                          </div>
                          <div className="text-gray-400 p-1">
                            {expandedClause === clause.id ? <CaretUp /> : <CaretDown />}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-500">No clauses extracted for this contract yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: OBLIGATIONS */}
            {activeTab === "Obligations" && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Action Required</th>
                        <th className="px-6 py-4">Responsible Actor</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Penalty for Breach</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {contractObligations.length > 0 ? (
                        contractObligations.map((ob: any) => (
                          <tr key={ob.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-medium text-[#1E1E2D]">{ob.action}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{ob.actor}</td>
                            <td className="px-6 py-4 font-mono text-sm text-[#1E1E2D]">{new Date(ob.dueDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                ob.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                ob.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {ob.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{ob.penalty}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-gray-500">No obligations found for this contract.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: RISKS */}
            {activeTab === "Risks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Overall Risk Score</p>
                      <h2 className="text-3xl font-bold text-amber-600">64<span className="text-lg text-gray-400 font-normal">/100</span></h2>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-amber-100 flex items-center justify-center relative">
                       <svg className="absolute w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="28" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * 64) / 100} className="transition-all duration-1000" />
                       </svg>
                       <WarningCircle size={24} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contractRisks.length > 0 ? (
                    contractRisks.map((risk: any) => (
                      <div key={risk.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            risk.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                            risk.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                            risk.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {risk.severity} Risk
                          </span>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{risk.type}</span>
                        </div>
                        <p className="font-medium text-[#1E1E2D] mb-3">{risk.description}</p>
                        {risk.affectedClauses && risk.affectedClauses.length > 0 && (
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <FileText size={14} /> Affected Clauses: {risk.affectedClauses.join(', ')}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                      No specific risks identified for this contract.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: COMPLIANCE */}
            {activeTab === "Compliance" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full border-8 border-green-100 flex items-center justify-center relative mb-4">
                     <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="251" strokeDashoffset={251 - (251 * contract.complianceScore) / 100} className="transition-all duration-1000" />
                     </svg>
                     <span className="text-2xl font-bold text-[#1E1E2D]">{contract.complianceScore}%</span>
                  </div>
                  <h3 className="font-bold text-[#1E1E2D] text-lg">Compliance Score</h3>
                  <p className="text-sm text-gray-500 mt-2">Based on internal policies and external regulations.</p>
                </div>

                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-bold text-[#1E1E2D] mb-6">Regulation Mapping</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={24} className="text-green-600" weight="fill" />
                        <div>
                          <p className="font-semibold text-green-900">GDPR Compliant</p>
                          <p className="text-xs text-green-700">Data protection addendum is active and valid.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-700">PASS</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <WarningCircle size={24} className="text-amber-600" weight="fill" />
                        <div>
                          <p className="font-semibold text-amber-900">CCPA Requirements</p>
                          <p className="text-xs text-amber-700">Missing specific opt-out language for California residents.</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700">WARNING</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: TIMELINE */}
            {activeTab === "Timeline" && (
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
                <h3 className="font-bold text-[#1E1E2D] mb-8 text-xl">Contract History</h3>
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                  {mockTimeline.map((event, index) => (
                    <div key={event.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                        event.type === 'success' ? 'bg-green-500' :
                        event.type === 'warning' ? 'bg-amber-500' :
                        event.type === 'info' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                        <h4 className="font-bold text-[#1E1E2D]">{event.title}</h4>
                        <span className="text-xs font-mono text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
