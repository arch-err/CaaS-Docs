---
title: Python
description:
  Maintained Python runtime image for web services, workers, and automation.
caas:
  type: container
  aliases:
    - python3
    - uv
    - fastapi
    - django
  capabilities:
    - Python runtime
    - UV package management
    - non-root execution
  lifecycle: stable
  owner: Platform Engineering
  upstream:
    name: Python
    description:
      General-purpose programming language maintained by the Python community.
    homepage: https://www.python.org/
    documentation: https://docs.python.org/3/
    source: https://github.com/python/cpython
  container:
    category: runtime
    image: registry.example.invalid/caas/python
    versions:
      - '3.13'
      - '3.14'
    architectures:
      - amd64
      - arm64
    protocols:
      - HTTP
    stateful: false
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
