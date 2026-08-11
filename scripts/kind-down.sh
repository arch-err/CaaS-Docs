#!/usr/bin/env bash
set -Eeuo pipefail

cluster_name="caas-docs-poc"

if kind get clusters | grep -Fxq "$cluster_name"; then
  kind delete cluster --name "$cluster_name"
else
  echo "kind cluster $cluster_name does not exist"
fi

