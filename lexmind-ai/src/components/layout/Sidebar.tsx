'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  HouseLine,
  Upload,
  FileText,
  MagnifyingGlass,
  TreeStructure,
  ShieldWarning,
  CheckCircle,
  ListChecks,
  GitDiff,
  Handshake,
  ChartBar,
  Graph,
  Gear,
  ClockCounterClockwise,
  CaretLeft,
  CaretRight,
  SignOut
} from '@phosphor-icons/react'

const NAVIGATION = [
  {
    group: 'Main',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HouseLine },
      { name: 'Upload', href: '/upload', icon: Upload },
      { name: 'Contracts', href: '/contracts', icon: FileText },
      { name: 'Search', href: '/search', icon: MagnifyingGlass },
    ]
  },
  {
    group: 'Intelligence',
    items: [
      { name: 'Clause Explorer', href: '/clauses', icon: TreeStructure },
      { name: 'Risk Dashboard', href: '/risks', icon: ShieldWarning },
      { name: 'Compliance', href: '/compliance', icon: CheckCircle },
      { name: 'Obligations', href: '/obligations', icon: ListChecks },
    ]
  },
  {
    group: 'Tools',
    items: [
      { name: 'Compare', href: '/compare', icon: GitDiff },
      { name: 'Negotiate', href: '/negotiate', icon: Handshake },
      { name: 'Reports', href: '/reports', icon: ChartBar },
      { name: 'Graph Explorer', href: '/graph', icon: Graph },
    ]
  },
  {
    group: 'System',
    items: [
      { name: 'Settings', href: '/settings', icon: Gear },
      { name: 'Audit Log', href: '/audit', icon: ClockCounterClockwise },
    ]
  }
]

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (c: boolean) => void }) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      className="fixed left-0 top-0 z-40 h-[100dvh] bg-white border-r border-[#E2E8F0] flex flex-col hidden md:flex shrink-0 shadow-sm"
    >
      {/* Top: Logo */}
      <div className="h-16 flex items-center px-4 shrink-0 relative border-b border-[#E2E8F0]/50">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xl text-[#1E1E2D] font-display">LexMind</span>
              <span className="font-bold text-xl text-[#DC2626] font-display">AI</span>
            </div>
            <span className="text-xs text-[#64748B]">Legal Intelligence</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center text-xl font-bold text-[#DC2626] font-display">
            L
          </div>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 bg-white border border-[#E2E8F0] rounded-full p-1 text-[#64748B] hover:text-[#1E1E2D] hover:bg-[#FAFAFA] shadow-sm z-10 transition-colors"
        >
          {collapsed ? <CaretRight weight="bold" size={12} /> : <CaretLeft weight="bold" size={12} />}
        </button>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide space-y-6">
        {NAVIGATION.map((group, idx) => (
          <div key={idx} className="px-3">
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] uppercase tracking-widest text-[#64748B]/60 font-medium">
                {group.group}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative group",
                      isActive
                        ? "bg-[#DC2626]/10 text-[#DC2626] font-semibold"
                        : "text-[#64748B] hover:bg-[#FAFAFA] hover:text-[#1E1E2D]"
                    )}
                  >
                    {isActive && !collapsed && (
                      <motion.div layoutId="active-nav-indicator" className="absolute left-0 top-[10%] bottom-[10%] w-[3px] bg-[#DC2626] rounded-r-full" />
                    )}
                    <item.icon size={20} weight={isActive ? "fill" : "light"} className={cn("shrink-0", collapsed && "mx-auto")} />
                    {!collapsed && <span>{item.name}</span>}
                    
                    {collapsed && (
                      <div className="absolute left-14 px-2 py-1 bg-[#1E1E2D] text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-md">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Profile */}
      <div className="p-3 border-t border-[#E2E8F0]/50 shrink-0 bg-white">
        <div className={cn("flex items-center gap-3 rounded-xl p-2 transition-colors", !collapsed && "hover:bg-[#FAFAFA]")}>
          <div className="w-8 h-8 rounded-full bg-[#1E1E2D] flex items-center justify-center text-white text-xs font-medium shrink-0">
            AK
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-sm font-semibold text-[#1E1E2D] truncate">Arjun Krishnamurthy</span>
              <span className="text-xs text-[#64748B] truncate">Legal Admin</span>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded-lg hover:bg-red-50 transition-colors shrink-0">
              <SignOut size={16} weight="light" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
