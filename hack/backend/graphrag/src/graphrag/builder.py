from __future__ import annotations

import logging
from typing import Any

from shared.graph import get_neo4j_session

logger = logging.getLogger("lexmind.graph")

# Ontology per 06 §Knowledge Graph Ontology
NODE_LABELS = {
    "Contract",
    "Clause",
    "Party",
    "Obligation",
    "Risk",
    "Regulation",
    "Policy",
    "Amendment",
    "Deadline",
    "Jurisdiction",
    "Organization",
}

RELATIONSHIPS = {
    "CONTAINS",
    "REFERENCES",
    "BELONGS_TO",
    "REQUIRES",
    "DEPENDS_ON",
    "VIOLATES",
    "AMENDS",
    "EXPIRES_ON",
    "GOVERNED_BY",
}


class GraphBuilder:
    """Builds the Neo4j knowledge graph from contract analysis results."""

    async def upsert_node(
        self, label: str, key: str, properties: dict[str, Any] | None = None
    ) -> None:
        if label not in NODE_LABELS:
            raise ValueError(f"Unknown node label: {label}")
        props = properties or {}
        props["key"] = key
        cypher = f"""
        MERGE (n:{label} {{key: $key}})
        SET n += $props
        """
        async with get_neo4j_session() as session:
            await session.run(cypher, key=key, props=props)

    async def create_relationship(
        self,
        src_label: str,
        src_key: str,
        rel: str,
        dst_label: str,
        dst_key: str,
        props: dict[str, Any] | None = None,
    ) -> None:
        if rel not in RELATIONSHIPS:
            raise ValueError(f"Unknown relationship: {rel}")
        cypher = f"""
        MATCH (a:{src_label} {{key: $src_key}}), (b:{dst_label} {{key: $dst_key}})
        MERGE (a)-[r:{rel}]->(b)
        SET r += $props
        """
        async with get_neo4j_session() as session:
            await session.run(cypher, src_key=src_key, dst_key=dst_key, props=props or {})

    async def build_contract_graph(
        self,
        *,
        contract_id: str,
        title: str,
        jurisdiction: str | None,
        clauses: list[dict[str, Any]],
        parties: list[str],
        obligations: list[dict[str, Any]],
        risks: list[dict[str, Any]],
    ) -> None:
        """Create the full contract subgraph from pipeline results."""
        async with get_neo4j_session() as session:
            await session.run(
                """
                MERGE (c:Contract {key: $cid})
                SET c.title = $title, c.jurisdiction = $jurisdiction
                """,
                cid=contract_id,
                title=title,
                jurisdiction=jurisdiction,
            )

        for party in parties:
            await self.upsert_node("Party", party.lower(), {"name": party})
            await self.create_relationship(
                "Contract", contract_id, "BELONGS_TO", "Party", party.lower()
            )

        for i, clause in enumerate(clauses, start=1):
            clause_key = f"{contract_id}:clause:{i}"
            await self.upsert_node(
                "Clause",
                clause_key,
                {"text": clause.get("text", ""), "type": clause.get("type", "")},
            )
            await self.create_relationship(
                "Contract", contract_id, "CONTAINS", "Clause", clause_key
            )

        for i, ob in enumerate(obligations, start=1):
            ob_key = f"{contract_id}:obligation:{i}"
            await self.upsert_node(
                "Obligation",
                ob_key,
                {
                    "actor": ob.get("actor", ""),
                    "action": ob.get("action", ""),
                    "deadline": ob.get("deadline"),
                },
            )
            await self.create_relationship(
                "Contract", contract_id, "REQUIRES", "Obligation", ob_key
            )
            if ob.get("actor"):
                await self.create_relationship(
                    "Obligation", ob_key, "BELONGS_TO", "Party", ob["actor"].lower()
                )

        for i, risk in enumerate(risks, start=1):
            risk_key = f"{contract_id}:risk:{i}"
            await self.upsert_node(
                "Risk",
                risk_key,
                {
                    "category": risk.get("category", ""),
                    "severity": risk.get("severity", ""),
                    "description": risk.get("description", ""),
                },
            )
            await self.create_relationship(
                "Contract", contract_id, "DEPENDS_ON", "Risk", risk_key
            )

        if jurisdiction:
            await self.upsert_node("Jurisdiction", jurisdiction.lower(), {"name": jurisdiction})
            await self.create_relationship(
                "Contract", contract_id, "GOVERNED_BY", "Jurisdiction", jurisdiction.lower()
            )
        logger.info("graph built for contract %s", contract_id)
