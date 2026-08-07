from __future__ import annotations

import json
import re
from typing import Any, cast

_JSON_FENCE = re.compile(r"```(?:json)?\s*(\{.*?\})\s*```", re.S | re.I)
_JSON_OBJ = re.compile(r"\{.*\}", re.S)


def extract_json(text: str) -> dict[str, Any]:
    """Extract the first JSON object from LLM output, tolerating markdown fences.

    Returns an empty dict when no valid JSON is found.
    """
    match = _JSON_FENCE.search(text)
    if match:
        candidate = match.group(1)
    else:
        obj = _JSON_OBJ.search(text)
        candidate = obj.group(0) if obj else ""
    if not candidate:
        return {}
    try:
        parsed = json.loads(candidate)
        return cast(dict[str, Any], parsed) if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        return {}
