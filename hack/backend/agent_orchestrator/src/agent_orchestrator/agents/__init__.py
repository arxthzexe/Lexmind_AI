from agent_orchestrator.agents.audit import AuditAgent
from agent_orchestrator.agents.classification import ClassificationAgent
from agent_orchestrator.agents.clause import ClauseAgent
from agent_orchestrator.agents.comparison import ComparisonAgent
from agent_orchestrator.agents.compliance import ComplianceAgent
from agent_orchestrator.agents.graphrag import GraphRagAgent
from agent_orchestrator.agents.intake import IntakeAgent
from agent_orchestrator.agents.knowledge_graph import KnowledgeGraphAgent
from agent_orchestrator.agents.layout import LayoutAgent
from agent_orchestrator.agents.negotiation import NegotiationAgent
from agent_orchestrator.agents.ner import NerAgent
from agent_orchestrator.agents.obligation import ObligationAgent
from agent_orchestrator.agents.ocr import OcrAgent
from agent_orchestrator.agents.regulatory import RegulatoryIntelAgent
from agent_orchestrator.agents.report import ReportAgent
from agent_orchestrator.agents.risk import RiskAgent
from agent_orchestrator.agents.timeline import TimelineAgent

ALL_AGENTS = [
    IntakeAgent(),
    OcrAgent(),
    LayoutAgent(),
    ClassificationAgent(),
    ClauseAgent(),
    NerAgent(),
    ObligationAgent(),
    RiskAgent(),
    ComplianceAgent(),
    RegulatoryIntelAgent(),
    ComparisonAgent(),
    NegotiationAgent(),
    TimelineAgent(),
    KnowledgeGraphAgent(),
    GraphRagAgent(),
    ReportAgent(),
    AuditAgent(),
]

AGENT_REGISTRY: dict[str, object] = {a.spec.name: a for a in ALL_AGENTS}

__all__ = ["AGENT_REGISTRY", "ALL_AGENTS"]
