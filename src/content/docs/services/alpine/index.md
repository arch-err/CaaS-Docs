---
title: Alpine Linux
description:
  Minimal Linux base image for small utilities and tightly scoped workloads.
service:
  kind: base-image
  aliases:
    - alpine
    - minimal linux
    - busybox
  capabilities:
    - small image footprint
    - apk packages
    - shell utilities
  protocols: []
  architectures:
    - amd64
    - arm64
  supportedVersions:
    - '3.23'
  stateful: false
  lifecycle: stable
  owner: Platform Engineering
  containerImage: registry.example.invalid/caas/alpine
---

## Use this when

Choose Alpine for small shell utilities, init-style helpers, and workloads whose
dependencies are available through `apk`. Its musl-based userspace can expose
compatibility issues in software built specifically for glibc.

## Quick start

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: alpine-example
spec:
  containers:
    - name: alpine
      image: registry.example.invalid/caas/alpine:3.23
      command: ['sh', '-c', 'echo hello from Alpine && sleep 3600']
```

## Configuration

Install temporary packages without retaining the package index:

```dockerfile
FROM registry.example.invalid/caas/alpine:3.23
RUN apk add --no-cache ca-certificates curl
```

Run the workload as a numeric, non-root user and declare writable directories
explicitly.

## Observability

The base image does not include telemetry agents. Write logs to standard output
and expose application metrics from the packaged workload.

## Limits

- The image uses musl libc rather than glibc.
- Debugging tools are intentionally absent.
- Package versions follow the selected Alpine release branch.

## Support

Platform Engineering maintains the base image and its rebuild pipeline.
Application teams own packages added in downstream images.
