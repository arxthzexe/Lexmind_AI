'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CopilotDrawer } from './CopilotDrawer'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-[#1E1E2D] font-sans selection:bg-[#DC2626]/20">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1E1E2D]/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div 
        className={cn(
          "flex flex-col min-h-[100dvh] transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        )}
      >
        <TopBar setMobileMenuOpen={setMobileMenuOpen} onOpenCopilot={() => setCopilotOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 mx-auto w-full max-w-7xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            {children}
          </div>
        </main>
      </div>

      <CopilotDrawer isOpen={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  )
}
