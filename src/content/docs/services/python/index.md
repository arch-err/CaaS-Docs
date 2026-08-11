---
title: Python
description:
  Maintained Python runtime image for web services, workers, and automation.
service:
  kind: runtime
  aliases:
    - python3
    - uv
    - fastapi
    - django
  capabilities:
    - Python runtime
    - UV package management
    - non-root execution
  protocols:
    - HTTP
  architectures:
    - amd64
    - arm64
  supportedVersions:
    - '3.13'
    - '3.14'
  stateful: false
  lifecycle: stable
  owner: Platform Engineering
  containerImage: registry.example.invalid/caas/python
---

## Use this when

Choose this runtime for Python APIs, background workers, and scheduled
automation. The image is intentionally small and expects dependencies to be
locked with UV.

## Quick start

```dockerfile
FROM registry.example.invalid/caas/python:3.14

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .

USER 10001
CMD ["uv", "run", "python", "-m", "app"]
```

## Configuration

Configuration should enter through environment variables or mounted files. Keep
`uv.lock` committed and use `uv sync --frozen` so CI and production resolve the
same dependency graph.

## Observability

Write structured logs to standard output. HTTP workloads should expose a
dedicated health endpoint and Prometheus-compatible metrics where appropriate.

## Limits

- Compilers and development headers are not present in the runtime layer.
- The container filesystem should be treated as ephemeral.
- Native wheels must support the selected image architecture.

## Support

Platform Engineering owns the runtime and security rebuilds. Application teams
own Python dependencies, process configuration, and application-level telemetry.
