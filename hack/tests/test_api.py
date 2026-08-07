import pytest
from gateway.main import app
from httpx import ASGITransport, AsyncClient


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.anyio
async def test_health_returns_ok(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.anyio
async def test_version_returns_app(client):
    resp = await client.get("/version")
    assert resp.status_code == 200
    assert resp.json()["app"] == "LexMind AI"


@pytest.mark.anyio
async def test_me_requires_auth(client):
    resp = await client.get("/me")
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_me_with_invalid_token(client):
    resp = await client.get("/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_404_handler(client):
    resp = await client.get("/nope")
    assert resp.status_code == 404
    assert resp.json()["error"] == "Not Found"


@pytest.mark.anyio
async def test_openapi_schema_available(client):
    resp = await client.get("/openapi.json")
    assert resp.status_code == 200
    spec = resp.json()
    assert "/contracts/upload" in spec["paths"]
    assert "/contracts/compare" in spec["paths"]
