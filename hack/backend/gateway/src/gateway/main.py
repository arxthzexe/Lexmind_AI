from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from shared.auth import get_current_user, require_role
from shared.config import settings
from shared.db import init_db
from shared.graph import close_neo4j
from shared.storage import ensure_bucket
from shared.vector import ensure_collections
from starlette.middleware.cors import CORSMiddleware

from gateway.routers import agents, auth as auth_router, clauses, compliance, contracts, contracts_dct, obligations, reports, risks, search


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Graceful degradation: infra may be absent in dev/test. Log and continue
    # rather than crashing the gateway (per 04_WORKFLOW_ENGINE resilience principle).
    if not settings.app_skip_infra:
        for setup in (init_db, ensure_bucket, ensure_collections):
            try:
                await setup()
            except Exception as exc:
                import logging

                logging.getLogger("lexmind").warning(
                    "startup step %s failed: %s", setup.__name__, exc
                )
    yield
    try:
        await close_neo4j()
    except Exception:
        pass


app = FastAPI(
    title="LexMind AI Gateway",
    description="Enterprise Legal Intelligence Platform — API Gateway",
    version="1.0.0",
    lifespan=lifespan,
    contact={"name": "LexMind AI"},
    license_info={"name": "Proprietary"},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Processed-By"] = "LexMind-AI-Gateway"
    return response


@app.get("/", tags=["health"])
async def root() -> dict:
    return {
        "status": "ok",
        "service": "LexMind AI Gateway",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok", "service": "gateway", "env": settings.app_env}


@app.get("/version", tags=["health"])
async def version() -> dict:
    return {"app": "LexMind AI", "version": "1.0.0"}


@app.get("/me", tags=["auth"])
async def me(user: dict = Depends(get_current_user)) -> dict:
    return user


@app.get("/admin", tags=["auth"])
async def admin(user: dict = Depends(require_role("admin"))) -> dict:
    return {"authorized": True, "role": user.get("role")}


app.include_router(auth_router.router)
app.include_router(contracts.router)
app.include_router(contracts_dct.router)
app.include_router(reports.router)
app.include_router(search.router)
app.include_router(agents.router)
app.include_router(clauses.router)
app.include_router(obligations.router)
app.include_router(risks.router)
app.include_router(compliance.router)


@app.exception_handler(404)
async def not_found(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Not Found", "path": str(request.url.path)},
    )
