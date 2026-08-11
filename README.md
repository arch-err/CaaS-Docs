# CaaS Docs POC

A Git-backed catalog for supported Container-as-a-Service offerings. Each
service is one Markdown document, while Astro, Starlight, and Pagefind produce a
static, searchable site.

## Architecture

```text
main branch
    │
    ├─ GitHub Actions: format check, content validation, typecheck, build
    │
    └─ generated deploy branch
           │
           └─ git-sync ──atomic symlink──> nginx
```

The Kubernetes workload never builds the site. It anonymously polls the
generated `deploy` branch and serves the newest complete checkout. Git is the
only persistent state.

## Local development

Enter the Nix development shell and install the locked dependencies:

```console
nix develop
bun install --frozen-lockfile
just dev
```

Run all repository checks with:

```console
just check
```

See [the authoring guide](src/content/docs/authoring.md) before adding a
service.

## Local Kubernetes POC

The GitHub Actions workflow must have published the `deploy` branch before the
Pod can synchronize it.

Add this temporary hostname mapping:

```text
127.0.0.1 caas-docs.local
```

Then create the kind cluster, install ingress-nginx, and deploy the Helm
release:

```console
nix develop
just kind-up
curl http://caas-docs.local
```

Remove the cluster with `just kind-down`.

## Repository layout

```text
src/content/docs/services/   Service Markdown and colocated assets
src/components/              Catalog and documentation UI
deploy/helm/caas-docs/       git-sync and nginx Helm chart
kind/                        Local cluster configuration
scripts/                     Content validation and cluster bootstrap
.github/workflows/           CI and deploy-branch publication
```

## Deployment behavior

- git-sync polls every two seconds by default.
- Each checkout is published through an atomic symlink switch.
- nginx does not reload when documentation changes.
- HTML and Pagefind metadata are revalidated by clients; fingerprinted Astro
  assets are cached immutably.
- `version.json` identifies the source revision used for the active build.
