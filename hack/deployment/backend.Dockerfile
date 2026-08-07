# Generic backend service Dockerfile for LexMind AI services.
# Build: docker build -f deployment/backend.Dockerfile --build-arg SERVICE=clause_service .
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

FROM base AS builder
ARG SERVICE
COPY backend/shared /build/shared
COPY backend/${SERVICE} /build/service
RUN pip install --no-cache-dir /build/shared /build/service

FROM base AS runtime
ARG SERVICE
ARG ENTRYPOINT=main:app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY backend/shared/src /app/shared
COPY backend/${SERVICE}/src /app/service
ENV PYTHONPATH=/app
EXPOSE 80
CMD ["sh", "-c", "python -m uvicorn service.${ENTRYPOINT} --host 0.0.0.0 --port 80"]
