'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSiteContracts } from '@/lib/useSiteContracts';
import { 
  Scales, 
  Storefront, 
  CurrencyDollar, 
  Gear, 
  WarningCircle, 
  TrendUp,
  TrendDown
} from '@phosphor-icons/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const RISK_HISTORY_DATA = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 52 },
  { month: 'Mar', score: 48 },
  { month: 'Apr', score: 61 },
  { month: 'May', score: 55 },
  { month: 'Jun', score: 67 },
  { month: 'Jul', score: 72 },
  { month: 'Aug', score: 68 },
  { month: 'Sep', score: 81 },
  { month: 'Oct', score: 76 },
  { month: 'Nov', score: 85 },
  { month: 'Dec', score: 92 },
];

const PIE_DATA = [
  { name: 'Low', value: 45, color: '#10B981' },
  { name: 'Medium', value: 35, color: '#F59E0B' },
  { name: 'High', value: 15, color: '#EF4444' },
  { name: 'Critical', value: 5, color: '#991B1B' },
];

const RiskMetricCard = ({ title, score, trend, trendUp, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative overflow-hidden"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-xl">
        <Icon size={24} weight="duotone" className="text-slate-700" />
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
        trendUp ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {trendUp ? <TrendUp weight="bold" /> : <TrendDown weight="bold" />}
        {trend}%
      </div>
    </div>
    
    <div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-900 font-mono tracking-tight">{score}</div>
    </div>
  </motion.div>
);

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-red-900 text-red-100 border-red-800';
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function RisksDashboardPage() {
  const { risks, contracts } = useSiteContracts();
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-[100dvh]">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Risk Dashboard</h1>
          <p className="text-slate-500 mt-1">Enterprise risk exposure and critical alerts.</p>
        </div>
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-2 rounded-xl">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="font-semibold text-red-800 text-sm">High Exposure</span>
        </div>
      </div>

      {/* Top Row: Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskMetricCard title="Legal Risk" score="68" trend="+12" trendUp={true} icon={Scales} delay={0.1} />
        <RiskMetricCard title="Commercial Risk" score="42" trend="-5" trendUp={false} icon={Storefront} delay={0.2} />
        <RiskMetricCard title="Financial Risk" score="75" trend="+8" trendUp={true} icon={CurrencyDollar} delay={0.3} />
        <RiskMetricCard title="Operational Risk" score="31" trend="-14" trendUp={false} icon={Gear} delay={0.4} />
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-900">Overall Risk Trend</h3>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RISK_HISTORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Distribution Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col"
        >
          <h3 className="font-semibold text-slate-900 mb-2">Risk Distribution</h3>
          <div className="flex-1 relative min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-900 font-mono">124</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {PIE_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}</span>
                <span className="ml-auto font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Critical Alerts Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <WarningCircle size={20} className="text-red-600" weight="fill" />
            <h3 className="font-semibold text-slate-900">Critical & High Alerts</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-5 py-4 font-semibold">Risk ID</th>
                <th className="px-5 py-4 font-semibold">Severity</th>
                <th className="px-5 py-4 font-semibold">Type</th>
                <th className="px-5 py-4 font-semibold">Contract</th>
                <th className="px-5 py-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {risks.sort((a, b) => {
                const order: any = { Critical: 0, High: 1, Medium: 2, Low: 3 };
                return order[a.severity] - order[b.severity];
              }).map((risk) => {
                const contract = contracts.find(c => c.id === risk.contractId);
                return (
                  <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs">{risk.id}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getSeverityStyles(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </td>
                    <td className="px-5 py-4">{risk.type}</td>
                    <td className="px-5 py-4 max-w-[200px] truncate" title={contract?.title}>
                      {contract?.title || risk.contractId}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-md">{risk.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
