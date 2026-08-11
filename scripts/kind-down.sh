#!/usr/bin/env bash
set -Eeuo pipefail

cluster_name="caas-docs-poc"
route_container="caas-docs-traefik-route"

if docker container inspect "$route_container" >/dev/null 2>&1; then
  docker container rm --force "$route_container"
fi

if kind get clusters | grep -Fxq "$cluster_name"; then
  kind delete cluster --name "$cluster_name"
else
  echo "kind cluster $cluster_name does not exist"
fi
