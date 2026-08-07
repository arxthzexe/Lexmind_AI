'use client'

import { usePathname } from 'next/navigation'
import { MagnifyingGlass, Bell, List } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function TopBar({ setMobileMenuOpen, onOpenCopilot }: { setMobileMenuOpen: (o: boolean) => void; onOpenCopilot?: () => void }) {
  const pathname = usePathname()
  const paths = pathname?.split('/').filter(Boolean) || []
  
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-[#E2E8F0]/50 bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <button 
        className="md:hidden p-2 -ml-2 text-[#64748B] hover:text-[#1E1E2D] rounded-lg hover:bg-[#FAFAFA] transition-colors"
        onClick={() => setMobileMenuOpen(true)}
      >
        <List size={24} weight="light" />
      </button>

      <div className="flex-1 flex items-center gap-2 text-sm text-[#64748B]">
        <span className="capitalize hidden sm:inline-block">Dashboard</span>
        {paths.length > 0 && paths[0] !== 'dashboard' && (
          <>
            <span className="text-[#E2E8F0] hidden sm:inline-block">/</span>
            <span className="capitalize text-[#1E1E2D] font-medium">{paths[paths.length - 1].replace(/-/g, ' ')}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative hidden md:block">
          <MagnifyingGlass size={16} weight="light" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input 
            type="text" 
            placeholder="Search contracts..." 
            className="w-full md:w-[320px] h-9 pl-9 pr-12 rounded-full bg-[#FAFAFA] border border-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]/30 transition-all text-[#1E1E2D]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#E2E8F0] bg-white text-[10px] font-medium text-[#64748B]">
              ⌘K
            </kbd>
          </div>
        </div>

        <button className="relative p-2 text-[#64748B] hover:text-[#1E1E2D] hover:bg-[#FAFAFA] rounded-full transition-colors">
          <Bell size={20} weight="light" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white" />
        </button>

        <button 
          onClick={onOpenCopilot}
          className="flex items-center gap-2 bg-[#DC2626]/10 text-[#DC2626] rounded-full px-3 py-1.5 hover:bg-[#DC2626]/20 transition-colors border border-[#DC2626]/10 cursor-pointer"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]"></span>
          </div>
          <span className="text-xs sm:text-sm font-medium">Copilot</span>
        </button>
      </div>
    </header>
  )
}
