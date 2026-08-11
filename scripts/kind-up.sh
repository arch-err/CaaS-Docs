#!/usr/bin/env bash
set -Eeuo pipefail

cluster_name="caas-docs-poc"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
kubeconfig_path="${CAAS_DOCS_KUBECONFIG:-$repo_root/.kube/config}"
route_container="caas-docs-traefik-route"
traefik_address="${CAAS_DOCS_TRAEFIK_ADDRESS:-10.20.21.2}"

mkdir -p "$(dirname "$kubeconfig_path")"
export KUBECONFIG="$kubeconfig_path"

if ! kind get clusters | grep -Fxq "$cluster_name"; then
  kind create cluster --config "$repo_root/kind/cluster.yaml"
fi

kind export kubeconfig --name "$cluster_name" --kubeconfig "$kubeconfig_path"
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

if docker container inspect "$route_container" >/dev/null 2>&1; then
  docker container rm --force "$route_container"
fi

docker run --detach \
  --name "$route_container" \
  --network traefik \
  --restart unless-stopped \
  --label traefik.enable=true \
  --label 'traefik.http.routers.caas-docs-poc.rule=Host("caas-docs.local")' \
  --label traefik.http.routers.caas-docs-poc.entrypoints=websecure \
  --label traefik.http.routers.caas-docs-poc.tls=true \
  --label traefik.http.routers.caas-docs-poc.service=caas-docs-poc \
  --label "traefik.http.services.caas-docs-poc.loadbalancer.server.url=http://$traefik_address:8080" \
  alpine:3.23 sleep infinity >/dev/null

echo "CaaS Docs is ready at https://caas-docs.local"
