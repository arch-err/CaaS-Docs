---
title: Redis
description:
  Managed in-memory datastore for caches, queues, and short-lived coordination
  data.
service:
  kind: datastore
  aliases:
    - cache
    - key-value
    - queue
    - distributed lock
  capabilities:
    - persistence
    - replication
    - metrics
  protocols:
    - RESP
    - TCP
  architectures:
    - amd64
    - arm64
  supportedVersions:
    - '8.6'
  stateful: true
  lifecycle: stable
  owner: Platform Engineering
  containerImage: registry.example.invalid/caas/redis
---

## Use this when

Choose Redis for low-latency caches, rate limits, distributed locks, and queues
that can tolerate Redis persistence semantics. Do not treat it as a relational
database.

## Quick start

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: registry.example.invalid/caas/redis:8.6
          ports:
            - name: redis
              containerPort: 6379
```

## Configuration

Provide authentication through the platform secret mechanism. Configure memory
limits and an eviction policy together; an unconstrained cache can exhaust the
Pod memory limit before Redis can evict keys.

## Observability

Monitor memory fragmentation, evictions, rejected connections, replication lag,
and persistence failures. The package exposes a Prometheus metrics endpoint
through its bundled exporter.

## Limits

- Maximum availability depends on the selected replication profile.
- Large values increase latency and replication cost.
- Persistent volumes protect against Pod replacement, not logical corruption.

## Support

Platform Engineering owns the Redis image and platform integration. Consumers
own key design, retention behavior, capacity requests, and application retry
logic.
