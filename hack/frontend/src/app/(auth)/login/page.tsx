'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr'

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row bg-[#FAFAFA] font-sans">
      {/* Left branding area */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1E1E2D] p-12 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#DC2626]/20 via-[#DC2626]/5 to-transparent rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-16">
            <span className="font-bold text-3xl tracking-tight">LexMind</span>
            <span className="font-bold text-3xl text-[#DC2626] tracking-tight">AI</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-[1.1] mb-6 tracking-tight">
            Enterprise Legal<br />Intelligence
          </h1>
          <p className="text-[#FAFAFA]/70 text-lg max-w-md font-light leading-relaxed">
            AI-powered contract analysis, risk assessment, and compliance validation.
          </p>
          
          <div className="w-12 h-1 bg-[#DC2626] rounded-full mt-8" />
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center gap-3 text-[#FAFAFA]/70 text-sm font-medium">
            <CheckCircle size={20} weight="fill" className="text-[#DC2626]" />
            <span>SOC 2 Type II Compliant</span>
          </div>
          <div className="flex items-center gap-3 text-[#FAFAFA]/70 text-sm font-medium">
            <CheckCircle size={20} weight="fill" className="text-[#DC2626]" />
            <span>Bank-grade Encryption</span>
          </div>
          <div className="flex items-center gap-3 text-[#FAFAFA]/70 text-sm font-medium">
            <CheckCircle size={20} weight="fill" className="text-[#DC2626]" />
            <span>Enterprise Access Control</span>
          </div>
        </div>
      </div>

      {/* Right login area */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 justify-center items-center relative">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-1 mb-12 justify-center">
            <span className="font-bold text-3xl text-[#1E1E2D] tracking-tight">LexMind</span>
            <span className="font-bold text-3xl text-[#DC2626] tracking-tight">AI</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-[#1E1E2D] mb-2 tracking-tight">Welcome back</h2>
            <p className="text-[#64748B]">Sign in to your account to continue</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1E1E2D]" htmlFor="email">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="you@company.com" 
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E1E2D] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#1E1E2D]" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E1E2D] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 px-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-xl transition-all shadow-sm shadow-[#DC2626]/20 flex items-center justify-center mt-2"
            >
              Sign in
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[#E2E8F0] text-center">
            <p className="text-xs text-[#64748B] font-medium">
              Powered by AI · Enterprise Grade Security · SOC 2 Compliant
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
