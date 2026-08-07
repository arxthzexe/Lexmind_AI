export const contracts = [
  {
    id: 'CTR-2024-0891',
    title: 'Master Services Agreement - Meridian Technologies',
    partyA: 'LexMind Corporation',
    partyB: 'Meridian Technologies Inc.',
    status: 'Active',
    riskLevel: 'Low',
    effectiveDate: '2025-01-15',
    expirationDate: '2028-01-14',
    complianceScore: 94,
    value: 1250000,
  },
  {
    id: 'CTR-2024-0912',
    title: 'Software Licensing Agreement - Blackstone Capital Partners',
    partyA: 'LexMind Corporation',
    partyB: 'Blackstone Capital Partners LLC',
    status: 'Review',
    riskLevel: 'Medium',
    effectiveDate: '2025-03-01',
    expirationDate: '2027-02-28',
    complianceScore: 78,
    value: 850000,
  },
  {
    id: 'CTR-2024-0933',
    title: 'Non-Disclosure Agreement - Westfield Legal Associates',
    partyA: 'LexMind Corporation',
    partyB: 'Westfield Legal Associates',
    status: 'Active',
    riskLevel: 'Low',
    effectiveDate: '2025-02-10',
    expirationDate: '2026-02-09',
    complianceScore: 98,
    value: 0,
  },
  {
    id: 'CTR-2024-0941',
    title: 'Vendor Supplier Contract - Titan Infrastructure',
    partyA: 'LexMind Corporation',
    partyB: 'Titan Infrastructure Ltd',
    status: 'Pending',
    riskLevel: 'High',
    effectiveDate: '2025-04-01',
    expirationDate: '2026-03-31',
    complianceScore: 62,
    value: 2400000,
  },
  {
    id: 'CTR-2023-1102',
    title: 'Employment Agreement - Senior Data Scientist',
    partyA: 'LexMind Corporation',
    partyB: 'Dr. Evelyn Vance',
    status: 'Active',
    riskLevel: 'Low',
    effectiveDate: '2023-11-15',
    expirationDate: '2025-11-14',
    complianceScore: 99,
    value: 185000,
  },
  {
    id: 'CTR-2023-0855',
    title: 'Commercial Lease - 100 Market Street Suite 400',
    partyA: 'LexMind Corporation',
    partyB: 'Pinnacle Real Estate Holdings',
    status: 'Active',
    riskLevel: 'Medium',
    effectiveDate: '2024-01-01',
    expirationDate: '2029-12-31',
    complianceScore: 88,
    value: 3600000,
  },
  {
    id: 'CTR-2022-0419',
    title: 'Data Processing Addendum - CloudServe Networks',
    partyA: 'LexMind Corporation',
    partyB: 'CloudServe Networks',
    status: 'Expired',
    riskLevel: 'Critical',
    effectiveDate: '2022-05-01',
    expirationDate: '2024-04-30',
    complianceScore: 45,
    value: 450000,
  },
  {
    id: 'CTR-2024-1022',
    title: 'Joint Venture Agreement - Horizon Healthcare',
    partyA: 'LexMind Corporation',
    partyB: 'Horizon Healthcare Systems',
    status: 'Review',
    riskLevel: 'High',
    effectiveDate: '2025-06-01',
    expirationDate: '2030-05-31',
    complianceScore: 71,
    value: 15000000,
  }
];

export const clauses = [
  { id: 'CL-001', type: 'Payment', text: 'Invoices shall be paid within net 30 days of receipt.', confidence: 98, contractId: 'CTR-2024-0891' },
  { id: 'CL-002', type: 'Confidentiality', text: 'Receiving Party agrees to maintain the Confidential Information in strict confidence for a period of five (5) years.', confidence: 95, contractId: 'CTR-2024-0933' },
  { id: 'CL-003', type: 'Termination', text: 'Either party may terminate this Agreement upon ninety (90) days written notice.', confidence: 92, contractId: 'CTR-2024-0891' },
  { id: 'CL-004', type: 'Intellectual Property', text: 'All Intellectual Property created during the term of this Agreement shall be the exclusive property of the Client.', confidence: 89, contractId: 'CTR-2024-0912' },
  { id: 'CL-005', type: 'Indemnification', text: 'Vendor shall indemnify, defend, and hold harmless the Company from any claims arising from negligence.', confidence: 85, contractId: 'CTR-2024-0941' },
  { id: 'CL-006', type: 'Limitation of Liability', text: 'Total liability under this Agreement shall not exceed the total fees paid in the preceding twelve months.', confidence: 91, contractId: 'CTR-2024-0912' },
  { id: 'CL-007', type: 'Governing Law', text: 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware.', confidence: 99, contractId: 'CTR-2024-0891' },
  { id: 'CL-008', type: 'Dispute Resolution', text: 'Any disputes shall be resolved through binding arbitration in New York City.', confidence: 94, contractId: 'CTR-2024-0941' },
  { id: 'CL-009', type: 'Force Majeure', text: 'Neither party shall be liable for delay due to causes beyond reasonable control, including acts of God or natural disasters.', confidence: 96, contractId: 'CTR-2024-0912' },
  { id: 'CL-010', type: 'Assignment', text: 'This Agreement may not be assigned without prior written consent from the other Party.', confidence: 97, contractId: 'CTR-2024-0891' },
  { id: 'CL-011', type: 'Non-Compete', text: 'Employee shall not engage in any competing business for a period of 12 months following termination.', confidence: 90, contractId: 'CTR-2023-1102' },
  { id: 'CL-012', type: 'Severability', text: 'If any provision is found invalid, the remaining provisions shall remain in full force.', confidence: 98, contractId: 'CTR-2024-0933' },
  { id: 'CL-013', type: 'Notice', text: 'All notices must be sent via certified mail to the registered corporate addresses.', confidence: 95, contractId: 'CTR-2024-0941' },
  { id: 'CL-014', type: 'Audit Rights', text: 'Company reserves the right to audit Vendor facilities once annually with 30 days notice.', confidence: 88, contractId: 'CTR-2024-0941' },
  { id: 'CL-015', type: 'Data Protection', text: 'Processor shall implement appropriate technical measures to ensure security of Personal Data.', confidence: 93, contractId: 'CTR-2022-0419' }
];

export const obligations = [
  { id: 'OB-101', contractId: 'CTR-2024-0891', actor: 'Meridian Technologies Inc.', action: 'Deliver Q1 Progress Report', dueDate: '2025-04-15', status: 'Pending', penalty: '5% fee reduction' },
  { id: 'OB-102', contractId: 'CTR-2024-0891', actor: 'LexMind Corporation', action: 'Process Initial Payment', dueDate: '2025-02-15', status: 'Completed', penalty: 'Late interest at 1.5% per month' },
  { id: 'OB-103', contractId: 'CTR-2024-0941', actor: 'Titan Infrastructure Ltd', action: 'Provide Certificate of Insurance', dueDate: '2025-03-15', status: 'Pending', penalty: 'Contract Suspension' },
  { id: 'OB-104', contractId: 'CTR-2024-0912', actor: 'Blackstone Capital Partners LLC', action: 'Complete Security Audit', dueDate: '2025-06-01', status: 'Pending', penalty: 'Breach of Contract' },
  { id: 'OB-105', contractId: 'CTR-2022-0419', actor: 'CloudServe Networks', action: 'Delete stored user data post-termination', dueDate: '2024-05-30', status: 'Pending', penalty: 'Regulatory fines and liability' },
  { id: 'OB-106', contractId: 'CTR-2023-0855', actor: 'LexMind Corporation', action: 'Renew property insurance policy', dueDate: '2024-12-01', status: 'Completed', penalty: 'Default under lease terms' },
  { id: 'OB-107', contractId: 'CTR-2024-1022', actor: 'Horizon Healthcare Systems', action: 'Appoint steering committee members', dueDate: '2025-07-01', status: 'Pending', penalty: 'Delay in operational launch' },
  { id: 'OB-108', contractId: 'CTR-2024-0933', actor: 'Westfield Legal Associates', action: 'Return proprietary documents', dueDate: '2026-02-15', status: 'Pending', penalty: 'Injunctive relief' },
  { id: 'OB-109', contractId: 'CTR-2023-1102', actor: 'Dr. Evelyn Vance', action: 'Submit annual conflict of interest declaration', dueDate: '2024-11-15', status: 'Completed', penalty: 'Disciplinary action' },
  { id: 'OB-110', contractId: 'CTR-2024-0941', actor: 'Titan Infrastructure Ltd', action: 'Update SOC 2 Type II Report', dueDate: '2025-05-01', status: 'Pending', penalty: 'Termination for cause' }
];

export const risks = [
  { id: 'RSK-001', contractId: 'CTR-2022-0419', type: 'Compliance', severity: 'Critical', description: 'Data processing addendum expired but services are still active. GDPR violation risk.', affectedClauses: ['CL-015'] },
  { id: 'RSK-002', contractId: 'CTR-2024-0941', type: 'Financial', severity: 'High', description: 'Uncapped liability clause detected in vendor contract.', affectedClauses: ['CL-005', 'CL-006'] },
  { id: 'RSK-003', contractId: 'CTR-2024-0912', type: 'Operational', severity: 'Medium', description: 'SLA uptime guarantee drops below standard 99.9% requirement.', affectedClauses: [] },
  { id: 'RSK-004', contractId: 'CTR-2024-0891', type: 'Legal', severity: 'Low', description: 'Governing law specified as non-standard jurisdiction (Texas instead of Delaware).', affectedClauses: ['CL-007'] },
  { id: 'RSK-005', contractId: 'CTR-2024-1022', type: 'Strategic', severity: 'High', description: 'Exclusivity clause limits future partnerships in healthcare vertical.', affectedClauses: [] },
  { id: 'RSK-006', contractId: 'CTR-2024-0933', type: 'Intellectual Property', severity: 'Medium', description: 'Ambiguous definition of "Derived Works" in IP section.', affectedClauses: ['CL-004'] },
  { id: 'RSK-007', contractId: 'CTR-2023-0855', type: 'Financial', severity: 'Medium', description: 'Rent escalation tied to uncapped CPI index.', affectedClauses: [] },
  { id: 'RSK-008', contractId: 'CTR-2024-0941', type: 'Regulatory', severity: 'High', description: 'Missing mandatory anti-bribery (FCPA) compliance language.', affectedClauses: [] }
];

export const agents = [
  { id: 'agt-1', name: 'Chief Legal Officer', role: 'Orchestrator', status: 'Idle', confidence: 100, lastAction: 'Delegated review of CTR-2024-0912 to Clause Agent' },
  { id: 'agt-2', name: 'Intake Agent', role: 'Ingestion', status: 'Active', confidence: 99, lastAction: 'Ingesting 5 new documents from email gateway' },
  { id: 'agt-3', name: 'OCR Agent', role: 'Processing', status: 'Idle', confidence: 97, lastAction: 'Extracted text from scanned PDF (CTR-2024-0941)' },
  { id: 'agt-4', name: 'Layout Agent', role: 'Parsing', status: 'Active', confidence: 95, lastAction: 'Identifying section headers in Horizon JV Agreement' },
  { id: 'agt-5', name: 'Classification Agent', role: 'Categorization', status: 'Idle', confidence: 98, lastAction: 'Classified incoming doc as Non-Disclosure Agreement' },
  { id: 'agt-6', name: 'Clause Agent', role: 'Extraction', status: 'Active', confidence: 94, lastAction: 'Extracting Indemnification terms from Blackstone contract' },
  { id: 'agt-7', name: 'NER Agent', role: 'Entity Recognition', status: 'Idle', confidence: 96, lastAction: 'Identified 12 entities in Meridian MSA' },
  { id: 'agt-8', name: 'Obligation Agent', role: 'Tracking', status: 'Active', confidence: 92, lastAction: 'Flagged upcoming insurance renewal deadline' },
  { id: 'agt-9', name: 'Risk Agent', role: 'Analysis', status: 'Active', confidence: 91, lastAction: 'Scoring uncapped liability risk in Titan contract' },
  { id: 'agt-10', name: 'Compliance Agent', role: 'Auditing', status: 'Idle', confidence: 97, lastAction: 'Verified GDPR clauses in standard template' },
  { id: 'agt-11', name: 'Regulatory Agent', role: 'Monitoring', status: 'Idle', confidence: 95, lastAction: 'Checked recent changes in Delaware corporate law' },
  { id: 'agt-12', name: 'Comparison Agent', role: 'Redlining', status: 'Active', confidence: 93, lastAction: 'Generating redline against standard playbook' },
  { id: 'agt-13', name: 'Negotiation Agent', role: 'Strategy', status: 'Idle', confidence: 88, lastAction: 'Drafted counter-proposal for payment terms' },
  { id: 'agt-14', name: 'Timeline Agent', role: 'Scheduling', status: 'Idle', confidence: 99, lastAction: 'Mapped milestones for Horizon JV' },
  { id: 'agt-15', name: 'Knowledge Graph Agent', role: 'Mapping', status: 'Active', confidence: 94, lastAction: 'Linking Meridian entities to parent company' },
  { id: 'agt-16', name: 'GraphRAG Agent', role: 'Querying', status: 'Idle', confidence: 95, lastAction: 'Answered "What is our exposure to Blackstone?"' },
  { id: 'agt-17', name: 'Report Agent', role: 'Generation', status: 'Idle', confidence: 98, lastAction: 'Generated weekly risk summary report' }
];

export const recentActivity = [
  { id: 'act-1', type: 'risk_detected', message: 'Critical risk identified: Expired DPA in CloudServe contract.', timestamp: '10 mins ago' },
  { id: 'act-2', type: 'contract_uploaded', message: 'Intake Agent processed Horizon Healthcare Joint Venture Agreement.', timestamp: '45 mins ago' },
  { id: 'act-3', type: 'obligation_met', message: 'LexMind Corporation completed property insurance renewal.', timestamp: '2 hours ago' },
  { id: 'act-4', type: 'redline_complete', message: 'Comparison Agent completed redlining for Blackstone SLA.', timestamp: '4 hours ago' },
  { id: 'act-5', type: 'report_generated', message: 'Weekly Compliance Report published by Report Agent.', timestamp: '1 day ago' }
];

export const stats = {
  totalContracts: 1248,
  activeRisks: 24,
  complianceScore: 92,
  pendingObligations: 156,
  trends: {
    contracts: '+12% this month',
    risks: '-5% this month',
    compliance: '+2 pts this month',
    obligations: '+8% this month'
  }
};
