set dotenv-load := true

default:
  @just --list

install:
  bun install --frozen-lockfile

dev:
  bun run dev --host 0.0.0.0

format:
  bun run format

check:
  bun run format:check
  bun run check
  helm lint deploy/helm/caas-docs

build:
  bun run build

preview: build
  bun run preview --host 0.0.0.0

kind-up:
  ./scripts/kind-up.sh

kind-down:
  ./scripts/kind-down.sh

