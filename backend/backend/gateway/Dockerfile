FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

FROM base AS builder
COPY backend/shared /build/shared
COPY backend/gateway /build/gateway
RUN pip install --no-cache-dir --user pip uv
ENV PATH="/root/.local/bin:$PATH"
WORKDIR /build
RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install --system --no-cache-dir /build/shared /build/gateway

FROM base AS runtime
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY backend/gateway/src /app/gateway
COPY backend/shared/src /app/shared
ENV PYTHONPATH=/app
EXPOSE 80
CMD ["python", "-m", "uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "80"]
