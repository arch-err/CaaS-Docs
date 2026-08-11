---
title: Redis chart
description:
  Helm chart for deploying the maintained Redis container with persistence,
  health checks, and platform defaults.
caas:
  type: chart
  aliases:
    - redis helm
    - cache chart
    - redis statefulset
  capabilities:
    - persistent storage
    - health checks
    - configurable resources
  lifecycle: stable
  owner: Platform Engineering
  upstream:
    name: Redis
    description:
      In-memory data store for caching, streaming, messaging, and search
      workloads.
    homepage: https://redis.io/
    documentation: https://redis.io/docs/latest/
    source: https://github.com/redis/redis
  chart:
    name: redis
    repository: oci://registry.example.invalid/caas/charts
    versions:
      - 0.1.0
    containers:
      - redis
---

## Use this when

Choose the chart when Redis should be installed as a complete Kubernetes
workload rather than assembled from raw manifests. It pins the platform Redis
container and provides reviewed defaults for probes, resources, and storage.

## Installation

```console
helm install redis oci://registry.example.invalid/caas/charts/redis \
  --version 0.1.0 \
  --namespace redis \
  --create-namespace
```

## Values

Override values in a committed environment-specific file:

```yaml
persistence:
  enabled: true
  size: 8Gi

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    memory: 512Mi
```

The chart controls the image repository and tag so installations continue to use
the linked CaaS container. Consumers should not replace it with an unrelated
image.

## Observability

The chart configures health probes and exposes the metrics endpoint supplied by
the Redis container. Monitor memory pressure, evictions, rejected connections,
replication lag, and persistence failures.

## Limits

- The chart deploys one Redis workload; it does not provision Redis Cloud.
- Storage classes and backup integration remain cluster-specific.
- Changing the managed image can invalidate the chart's operational defaults.

## Support

Platform Engineering owns chart templates, defaults, and upgrades. Consumers own
sizing, values overrides, data retention, and application retry behavior.
