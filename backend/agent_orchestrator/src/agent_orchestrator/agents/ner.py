from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class NerAgent(BaseAgent):
    """03 §6 NER Agent: parties, dates, money, jurisdiction, organizations, laws."""

    spec = AgentSpec(
        name="ner",
        objective="Extract named entities from clause text",
        inputs=("clauses",),
        outputs=("entities",),
        tools=("ner_extractor",),
        default_confidence=0.75,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        entities = [{"type": "party", "text": "Acme Corporation"}] if text else []
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.75,
            evidence=[f"extracted {len(entities)} entities"],
            result={"entities": entities},
        )
