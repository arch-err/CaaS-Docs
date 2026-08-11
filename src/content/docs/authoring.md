---
title: Authoring services
description: Add and maintain a service document without touching the site code.
---

Every catalog entry lives in its own folder:

```text
src/content/docs/services/<service-name>/
├── index.md
└── optional-local-assets
```

## Add a service

1. Copy an existing service folder with the closest service kind.
2. Replace every frontmatter value; do not invent new spellings for existing
   categories.
3. Keep all required level-two sections.
4. Run `just check` before opening a pull request.

The build validates frontmatter types and the repository validator enforces the
folder layout and section contract.

## Frontmatter contract

| Field               | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `kind`              | One of `base-image`, `runtime`, or `datastore`.              |
| `aliases`           | Terms people may search for instead of the formal name.      |
| `capabilities`      | Short workload-oriented features used by the catalog search. |
| `protocols`         | Network or application protocols exposed by the service.     |
| `architectures`     | Supported CPU architectures.                                 |
| `supportedVersions` | Versions available through the platform.                     |
| `stateful`          | Whether consumers should expect persistent state.            |
| `lifecycle`         | `experimental`, `preview`, `stable`, or `deprecated`.        |
| `owner`             | Team responsible for the CaaS packaging.                     |
| `containerImage`    | Canonical image repository without credentials.              |

Keep aliases and capabilities useful to humans. For example, Redis should have
`cache` as an alias rather than a second category named `caching-database`.

## Required sections

Each service must contain these headings:

- `Use this when`
- `Quick start`
- `Configuration`
- `Observability`
- `Limits`
- `Support`

Additional sections are welcome when they answer a service-specific operational
question.

## Images and secrets

Store small diagrams or screenshots beside `index.md` and reference them with a
relative path. Do not add credentials, pull secrets, internal tokens, or example
values that resemble working secrets.
