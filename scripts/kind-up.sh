#!/usr/bin/env bash
set -Eeuo pipefail

cluster_name="caas-docs-poc"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! kind get clusters | grep -Fxq "$cluster_name"; then
  kind create cluster --config "$repo_root/kind/cluster.yaml"
fi

kubectl config use-context "kind-$cluster_name"

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx --force-update
helm repo update ingress-nginx
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --version 4.15.1 \
  --values "$repo_root/kind/ingress-values.yaml" \
  --wait \
  --timeout 5m

helm upgrade --install caas-docs "$repo_root/deploy/helm/caas-docs" \
  --namespace caas-docs \
  --create-namespace \
  --wait \
  --timeout 5m

kubectl --namespace caas-docs rollout status deployment/caas-docs-caas-docs \
  --timeout=2m

echo "CaaS Docs is ready at http://caas-docs.local"

