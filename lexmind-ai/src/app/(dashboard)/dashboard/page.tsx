'use client';

import { motion } from 'framer-motion';
import { useSiteContracts } from '@/lib/useSiteContracts';
import { agents } from '@/lib/mock-data';
import { formatCurrency, formatPercentage, getRiskColor } from '@/lib/utils';
import { TrendUp, TrendDown, FileText, ShieldWarning, CheckCircle, ListChecks, Lightning, Clock, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';

// Helper variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function DashboardPage() {
  const { contracts, obligations, activity: recentActivity, stats: dashboardStats } = useSiteContracts();

  const latestContracts = contracts.slice(0, 5);
  const latestActivity = recentActivity.slice(0, 5);
  const upcomingObligations = obligations
    .filter((o) => o.status === 'pending' || o.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const getUrgencyColor = (dueDate: string) => {
    const days = (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    if (days < 0) return 'text-crimson bg-crimson-light/20';
    if (days < 7) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-50 ring-green-600/20';
      case 'draft': return 'text-slate-600 bg-slate-50 ring-slate-500/10';
      case 'review': return 'text-amber-700 bg-amber-50 ring-amber-600/20';
      case 'expired': return 'text-crimson bg-crimson/10 ring-crimson/20';
      default: return 'text-slate-600 bg-slate-50 ring-slate-500/10';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-50 ring-green-600/20';
      case 'medium': return 'text-amber-700 bg-amber-50 ring-amber-600/20';
      case 'high': return 'text-crimson bg-crimson/10 ring-crimson/20';
      default: return 'text-slate-600 bg-slate-50 ring-slate-500/10';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Page Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your legal intelligence platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <button className="bg-crimson hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Generate Report
          </button>
        </div>
      </motion.div>

      {/* 2. Stat Cards Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Contracts */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-xl bg-crimson/10 p-2.5 text-crimson">
              <FileText size={24} weight="duotone" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
              <TrendUp size={16} weight="bold" />
              <span>+12.5%</span>
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Total Contracts</h3>
            <div className="text-3xl font-bold text-charcoal mt-1">{dashboardStats?.totalContracts || 847}</div>
          </div>
        </motion.div>

        {/* Active Risks */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600">
              <ShieldWarning size={24} weight="duotone" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
              <TrendDown size={16} weight="bold" />
              <span>-8.3%</span>
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Active Risks</h3>
            <div className="text-3xl font-bold text-charcoal mt-1">{dashboardStats?.activeRisks || 23}</div>
          </div>
        </motion.div>

        {/* Compliance Score */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-xl bg-green-100 p-2.5 text-green-600">
              <CheckCircle size={24} weight="duotone" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-md">
              <TrendUp size={16} weight="bold" />
              <span>+2.1%</span>
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Compliance Score</h3>
            <div className="text-3xl font-bold text-charcoal mt-1">{dashboardStats?.complianceScore ? formatPercentage(dashboardStats.complianceScore) : '94.2%'}</div>
          </div>
        </motion.div>

        {/* Pending Obligations */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
              <ListChecks size={24} weight="duotone" />
            </div>
            <div className="flex items-center gap-1 text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded-md">
              <TrendUp size={16} weight="bold" />
              <span>+5 new</span>
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium">Pending Obligations</h3>
            <div className="text-3xl font-bold text-charcoal mt-1">{dashboardStats?.pendingObligations || 31}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* Recent Contracts Table */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-charcoal">Recent Contracts</h2>
              <Link href="/contracts" className="text-sm text-crimson font-medium hover:text-red-700 flex items-center gap-1">
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contract Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Parties</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {latestContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-charcoal group-hover:text-crimson transition-colors">{contract.title}</div>
                        <div className="text-xs text-slate-500">
                          {contract.title.includes('MSA') ? 'Master Services Agreement' : contract.title.includes('NDA') ? 'Non-Disclosure Agreement' : 'SLA'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-charcoal truncate max-w-[150px]">{contract.partyA}, {contract.partyB}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ring-inset ${getStatusColor(contract.status)}`}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ring-1 ring-inset ${getRiskBadgeColor(contract.riskLevel)}`}>
                          {contract.riskLevel.charAt(0).toUpperCase() + contract.riskLevel.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(contract.effectiveDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* AI Processing Feed */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-charcoal">AI Agent Activity</h2>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-crimson"></span>
                </span>
              </div>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {latestActivity.map((activity: any) => {
                return (
                  <div key={activity.id} className="flex gap-4 items-start">
                    <div className="mt-1 bg-slate-100 rounded-full p-2 text-slate-600 flex-shrink-0">
                      <Lightning size={16} weight="fill" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock size={12} />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Compliance Gauge */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-charcoal w-full text-left mb-6">Overall Compliance</h2>
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="54" fill="none" stroke="#DC2626" strokeWidth="12"
                  strokeDasharray="339.292"
                  strokeDashoffset={339.292 - (339.292 * 94.2) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-charcoal">94.2<span className="text-xl">%</span></span>
                <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Score</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-crimson"></span>
                <span className="text-slate-600 font-medium">Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                <span className="text-slate-600 font-medium">Under Review</span>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Obligations */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6">
            <h2 className="text-lg font-bold text-charcoal mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingObligations.map((obligation) => (
                <div key={obligation.id} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`flex flex-col items-center justify-center rounded-lg min-w-[50px] p-2 text-center ${getUrgencyColor(obligation.dueDate)}`}>
                    <span className="text-xs font-bold uppercase">{new Date(obligation.dueDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-black leading-none">{new Date(obligation.dueDate).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-charcoal truncate">{obligation.action}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{obligation.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Agent Status Grid */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-charcoal">17 AI Agents</h2>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                All Operational
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Extractor', status: 'active' },
                { name: 'Risk Eval', status: 'processing' },
                { name: 'Compliance', status: 'active' },
                { name: 'Clause Gen', status: 'idle' },
                { name: 'Reviewer', status: 'active' },
                { name: 'Summarizer', status: 'processing' },
              ].map((agent, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
                  <span className={`relative flex h-2 w-2 flex-shrink-0 ${agent.status === 'processing' ? '' : 'rounded-full'}`}>
                    {agent.status === 'processing' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      agent.status === 'active' ? 'bg-green-500' :
                      agent.status === 'processing' ? 'bg-crimson' : 'bg-slate-300'
                    }`}></span>
                  </span>
                  <span className="text-xs font-medium text-slate-600 truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
