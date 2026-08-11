---
title: Authoring CaaS entries
description:
  Add and maintain a container or chart without touching the site code.
---

Every catalog entry lives in its own folder:

```text
src/content/docs/services/<entry-slug>/
├── index.md
└── optional-local-assets
```

## Add a CaaS entry

1. Copy an existing container or chart folder.
2. Replace every frontmatter value; do not invent new spellings for existing
   categories.
3. Keep all required level-two sections.
4. Run `just check` before opening a pull request.

The build validates frontmatter types and the repository validator enforces the
folder layout and section contract.

## Common frontmatter

Every document has a `caas` object with these fields:

| Field          | Purpose                                                      |
| -------------- | ------------------------------------------------------------ |
| `type`         | Exactly `container` or `chart`.                              |
| `aliases`      | Terms people may search for instead of the formal name.      |
| `capabilities` | Short workload-oriented features used by the catalog search. |
| `lifecycle`    | `experimental`, `preview`, `stable`, or `deprecated`.        |
| `owner`        | Team responsible for the CaaS packaging.                     |
| `upstream`     | Identity and authoritative links for the external project.   |

The `upstream` object requires `name`, `description`, `homepage`, and
`documentation`. Add `source` when a public source repository exists. Upstream
metadata describes the external project; `owner` describes who maintains the
CaaS package.

## Container fields

A `container` entry has a nested `container` object:

| Field           | Purpose                                                               |
| --------------- | --------------------------------------------------------------------- |
| `category`      | `base-image`, `runtime`, `datastore`, or `application`.               |
| `image`         | Canonical OCI image repository without a tag or credentials.          |
| `versions`      | Image tags supported by the platform.                                 |
| `architectures` | Supported CPU architectures.                                          |
| `protocols`     | Network or application protocols exposed by the container.            |
| `stateful`      | Whether consumers should expect the container to use persistent data. |

## Chart fields

A `chart` entry has a nested `chart` object:

| Field        | Purpose                                              |
| ------------ | ---------------------------------------------------- |
| `name`       | Helm chart name.                                     |
| `repository` | HTTPS Helm repository or OCI repository prefix.      |
| `versions`   | Chart versions supported by the platform.            |
| `containers` | Slugs of every CaaS container deployed by the chart. |

Container references use folder slugs, such as `redis`. CI rejects missing
references, references to other charts, duplicate references, and charts with no
containers.

Keep aliases and capabilities useful to humans. For example, Redis should have
`cache` as an alias rather than a second category named `caching-database`.

## Required sections

Every entry must contain these headings:

- `Use this when`
- `Observability`
- `Limits`
- `Support`

Containers additionally require `Quick start` and `Configuration`. Charts
instead require `Installation` and `Values`.

Additional sections are welcome when they answer an entry-specific operational
question.

## Logo

Place one logo beside the document using one of these exact names:

- `logo.svg`
- `logo.png`
- `logo.jpg`

SVG is preferred for crisp rendering. Use a roughly square canvas and keep the
important artwork away from the bottom-right corner. The site overlays a small
container or Helm badge there automatically; do not bake the type marker into
the source logo.

When no supported logo file exists, the site renders a neutral monogram logo.
This lets a new entry build immediately while its approved artwork is prepared.

## Images and secrets

Store small diagrams or screenshots beside `index.md` and reference them with a
relative path. Do not add credentials, pull secrets, internal tokens, or example
values that resemble working secrets.
