from __future__ import annotations

import json
from pathlib import Path

from gateway.main import app


def export_openapi(out: str = "docs/openapi.json") -> None:
    spec = app.openapi()
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Path(out).write_text(json.dumps(spec, indent=2), encoding="utf-8")
    n_paths = len(spec["paths"])
    n_schemas = len(spec["components"]["schemas"])
    print(f"OpenAPI exported to {out} ({n_paths} paths, {n_schemas} schemas)")


if __name__ == "__main__":
    export_openapi()
