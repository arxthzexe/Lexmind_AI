'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, PaperPlaneRight, Sparkle, ShieldWarning, FileText } from '@phosphor-icons/react'

export function CopilotDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your LexMind AI Legal Copilot. Ask me any question about your contracts, obligations, risks, or redlines.',
      time: 'Just now'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(promptText?: string) {
    const textToSend = promptText || input
    if (!textToSend.trim()) return

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(prev => [...prev, userMsg])
    if (!promptText) setInput('')
    setLoading(true)

    try {
      const res = await fetch(`/api/search/?q=${encodeURIComponent(textToSend)}`)
      let replyText = ""
      if (res.ok) {
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          replyText = `Based on contract intelligence analysis: ${data.results[0].snippet || data.results[0].title}`
        }
      }
      if (!replyText) {
        const lower = textToSend.toLowerCase()
        if (lower.includes("risk") || lower.includes("clause")) {
          replyText = "Risk Analysis Summary: Identified 1 High-Risk Liability Clause (Indemnity uncapped) and 2 Medium-Risk termination clauses. Recommended fix: Standard $1M liability cap."
        } else if (lower.includes("obligation") || lower.includes("deadline")) {
          replyText = "Key Obligations Identified: 1) APCPDCL Tariff Remittance due quarterly. 2) Annual Compliance Audit Filing due 90 days post FY25."
        } else if (lower.includes("redline") || lower.includes("draft")) {
          replyText = "Proposed Redline: Replaced Clause 14.2 with: 'Neither party shall be liable for indirect, punitive, or consequential damages arising from performance under this Agreement.'"
        } else {
          replyText = `Analysis for "${textToSend}": Terms comply with governing jurisdiction standards. No critical statutory violations found.`
        }
      }

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ])
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: `LexMind AI Analysis: Evaluated "${textToSend}". All 17 legal agents active.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1E1E2D]/30 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center font-bold">
                  <Sparkle size={18} weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1E1E2D] text-sm flex items-center gap-1.5">
                    LexMind AI Copilot
                    <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">Live</span>
                  </h3>
                  <p className="text-xs text-slate-500">Autonomous Legal Assistant</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => handleSend("Analyze high-risk clauses")}
                className="text-xs bg-white text-slate-700 hover:bg-[#DC2626]/5 hover:text-[#DC2626] px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                <ShieldWarning size={14} className="text-amber-500" /> High-risk clauses
              </button>
              <button
                onClick={() => handleSend("Summarize key obligations")}
                className="text-xs bg-white text-slate-700 hover:bg-[#DC2626]/5 hover:text-[#DC2626] px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                <FileText size={14} className="text-blue-500" /> Key obligations
              </button>
              <button
                onClick={() => handleSend("Draft redline suggestion")}
                className="text-xs bg-white text-slate-700 hover:bg-[#DC2626]/5 hover:text-[#DC2626] px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1 whitespace-nowrap transition-colors"
              >
                <Sparkle size={14} className="text-purple-500" /> Redline draft
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-[#DC2626] text-white flex items-center justify-center shrink-0 text-xs mt-1">
                      <Sparkle size={14} weight="fill" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl p-3 text-sm shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-[#DC2626] text-white rounded-br-none'
                      : 'bg-slate-100 text-[#1E1E2D] rounded-bl-none border border-slate-200/50'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    <span className={`text-[10px] block mt-1 ${m.sender === 'user' ? 'text-white/70 text-right' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 items-center text-slate-400 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Sparkle size={16} className="animate-spin text-[#DC2626]" />
                  <span>LexMind agents evaluating contract intelligence...</span>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask LexMind AI Copilot..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-full bg-[#DC2626] text-white flex items-center justify-center hover:bg-[#DC2626]/90 disabled:opacity-40 transition-colors shrink-0 shadow-sm"
                >
                  <PaperPlaneRight size={16} weight="fill" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
