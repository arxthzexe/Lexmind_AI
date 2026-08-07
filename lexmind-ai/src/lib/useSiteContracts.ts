'use client'

import { useState, useEffect } from 'react'
import {
  contracts as baseContracts,
  clauses as baseClauses,
  obligations as baseObligations,
  risks as baseRisks,
  stats as baseStats,
  recentActivity as baseActivity,
} from '@/lib/mock-data'

export function useSiteContracts() {
  const [allContracts, setAllContracts] = useState<any[]>(baseContracts)
  const [allClauses, setAllClauses] = useState<any[]>(baseClauses)
  const [allObligations, setAllObligations] = useState<any[]>(baseObligations)
  const [allRisks, setAllRisks] = useState<any[]>(baseRisks)
  const [allActivity, setAllActivity] = useState<any[]>(baseActivity)

  function loadFromStorage() {
    if (typeof window === 'undefined') return
    const saved =
      sessionStorage.getItem('last_uploaded_contract') ||
      localStorage.getItem('last_uploaded_contract')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p && p.title) {
          const uploadedContract = {
            id: p.id || 'uploaded',
            title: p.title,
            partyA: p.partyA || 'APCPDCL (Southern Power Distribution)',
            partyB: p.partyB || 'AP-SPSU / Contractor',
            status: p.status || 'Active',
            riskLevel: p.riskLevel || 'Medium',
            effectiveDate: p.effectiveDate || '2024-04-01',
            expirationDate: p.expirationDate || '2029-03-31',
            complianceScore: p.complianceScore || 88,
            value: p.value || 5000000,
            clauses: p.clauses || [],
            obligations: p.obligations || [],
            risks: p.risks || [],
          }

          setAllContracts([
            uploadedContract,
            ...baseContracts.filter((c) => c.id !== uploadedContract.id),
          ])

          if (p.clauses && p.clauses.length > 0) {
            const extraClauses = p.clauses.map((c: any) => ({
              ...c,
              contractId: uploadedContract.id,
            }))
            setAllClauses([...extraClauses, ...baseClauses])
          }

          if (p.obligations && p.obligations.length > 0) {
            const extraObs = p.obligations.map((o: any) => ({
              ...o,
              contractId: uploadedContract.id,
            }))
            setAllObligations([...extraObs, ...baseObligations])
          }

          if (p.risks && p.risks.length > 0) {
            const extraRisks = p.risks.map((r: any) => ({
              ...r,
              contractId: uploadedContract.id,
            }))
            setAllRisks([...extraRisks, ...baseRisks])
          }

          setAllActivity([
            {
              id: 'act-uploaded',
              type: 'contract_uploaded',
              message: `Intake Agent processed ${p.title}`,
              timestamp: 'Just now',
            },
            ...baseActivity,
          ])
        }
      } catch (e) {}
    }
  }

  useEffect(() => {
    loadFromStorage()
    window.addEventListener('storage', loadFromStorage)
    return () => window.removeEventListener('storage', loadFromStorage)
  }, [])

  return {
    contracts: allContracts,
    clauses: allClauses,
    obligations: allObligations,
    risks: allRisks,
    activity: allActivity,
    stats: {
      ...baseStats,
      totalContracts: allContracts.length + 1240,
    },
  }
}
