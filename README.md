# Food Delivery Platform

A microservices-based food delivery demo platform (frontend + backend services) targeting AWS (EKS, ECR, RDS, S3, CloudFront). This README documents the project structure, architecture, minimal install/deploy steps, infrastructure notes, CI/CD flow, database schema, secrets handling, scaling, and troubleshooting.

Purpose note: this project demonstrates cost-optimized EKS deployments by combining EC2 `Spot Instances` with `On‑Demand` worker nodes. Kubernetes autoscaling (HPA + Cluster Autoscaler) keeps pods available and replaces Spot capacity when instances are reclaimed. This repository is a demo and not production‑hardened. So don't forget apply production security practices before using it in production.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Minimal installation & deploy (high level)](#minimal-installation--deploy-high-level)
  - [1. Build & push backend images](#1-build--push-backend-images)
  - [2. Build & publish frontend to S3 & CloudFront](#2-build--publish-frontend-to-s3--cloudfront)
  - [3. Deploy infra (Helm / ArgoCD / EKS)](#3-deploy-infra-helm--argocd--eks)
- [Infrastructure details](#infrastructure-details)
- [Database schema (summary)](#database-schema-summary)
- [Secrets management](#secrets-management)
- [CI/CD flow](#cicd-flow)
- [Kubernetes resources](#kubernetes-resources)
- [Scaling & performance](#scaling--performance)
- [Troubleshooting & common issues](#troubleshooting--common-issues)
- [Future enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project demonstrates an end-to-end cloud native deployment of a food-delivery style platform. The application is split into a React single-page frontend and several backend microservices (Go, PHP, Python Flask, and Node.js) running on EKS with PostgreSQL. The focus is cost-optimized cluster design: pods are scheduled across mixed Spot and On‑Demand node groups and autoscaled to maintain availability when capacity changes. Infrastructure is managed through Helm charts and GitOps (ArgoCD).

## Architecture

- Frontend: React (Vite + Tailwind) hosted on S3 and distributed via CloudFront (private origin)
- Backend microservices (deployed on EKS):
  - `restaurant-service` (Python) — port 8081
  - `menu-service` (NodeJs)       — port 8082
  - `cart-service` (Go)       — port 8084
  - `order-service` (PHP)     — port 80
- RDS (PostgreSQL) for persistent data
- ECR for storing container images
- ALB Ingress Controller for API routing to services
- Helm charts under `infra-repo/helm-chart/` used by ArgoCD

## Repository layout

- `app-repo/`
  - `frontend/` — React app (Vite + Tailwind)
  - `backend/` — microservices folders (restaurant-service, menu-service, cart-service, order-service)
- `infra-repo/`
  - `helm-chart/` — Helm templates and `values.yaml`
  - `argocd-apps` — ArgoCD app manifests
  - `eks-cluster.yaml` — `eksctl` cluster definition

## Prerequisites

Install and configure the following on your machine or CI runner before performing deployments:

- AWS CLI (configured with appropriate IAM credentials)
- kubectl
- eksctl (if managing EKS via eksctl)
- Helm (v3+)
- Docker (or a container builder)
- Jenkins

Ensure you have the following AWS resources and permissions:

- ECR repository per service (or a shared repo with tags)
- An EKS cluster with nodes and cluster role permissions
- An RDS PostgreSQL instance and network connectivity from EKS
- S3 bucket for frontend assets and CloudFront distribution
- A bastion/CI host (EC2) with Jenkins configured (the reference setup uses Jenkins on an EC2 bastion host).

---

## Installation & deploy (high level)

Below are the minimal steps to deploy the project into AWS (high level). The aim is to be compact — follow your organizational standards for production deployments (security, IaC review, secrets handling).

### 1. Build & push backend images

For each backend service (example: `restaurant-service`):

PowerShell example (repeat per service, adjust names and tags):

```powershell
# Build
docker build -t your-account-id.dkr.ecr.<region>.amazonaws.com/restaurant-service:latest ./backend/restaurant-service

# Authenticate docker to ECR (example)
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin your-account-id.dkr.ecr.<region>.amazonaws.com

# Push
docker push your-account-id.dkr.ecr.<region>.amazonaws.com/restaurant-service:latest
```

Notes:
- Create ECR repos (one per service) ahead of time or use an automated script to create them.
- Tag images by commit SHA in CI for traceability.

### 2. Build & publish frontend to S3 & CloudFront

From the `frontend/` folder:

```powershell
cd frontend
npm install
npm run build      # generates dist/ or build/ depending on Vite config

# Sync build to S3
aws s3 sync ./dist s3://your-frontend-bucket

# Invalidate CloudFront cache (optional)
aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
```

Notes:
- CloudFront needs to be configured with origin access or signed URLs for secure S3 origin.

### 3. Deploy infra (Helm / ArgoCD / EKS)

Option A — Helm (manual/CI-triggered):

1. Update `values.yaml` for `image.repository` and `image.tag` per service.
2. Apply Helm chart to target namespace(s):

```powershell
helm upgrade --install food-delivery ./infra-repo/helm-chart -n food-delivery --create-namespace --values ./infra-repo/helm-chart/values.yaml
```

Option B — ArgoCD (GitOps):

- Push updated Helm `values.yaml` (or image tags) to `infra-repo` in Git.
- ArgoCD will detect changes and sync the EKS workloads automatically if configured.

Notes:
- Ensure the Helm chart uses Kubernetes `Secret` or external secrets for DB credentials.
- If RBAC or namespaces are required, apply them before deploying the chart.

---

## Infrastructure details

- EKS cluster (recommended node sizing: 1 on-demand + 3 spot t3.medium in the reference)
- ALB Ingress for path-based routing to services
- S3 bucket + CloudFront for frontend hosting
- RDS PostgreSQL in private subnets
- ECR to store images
- Helm chart templates for Deployments, Services, HPA, ConfigMaps, and Secrets

ArgoCD is used as the GitOps operator to sync `infra-repo` into the cluster whenever Helm values or manifests change.

## Database schema (summary)

The primary tables used by the services:

- `restaurant_restaurants` — id, name, slug, cuisine, rating, logo_key, address_json
- `menu_items` — id, restaurant_slug, name, description, price_paise, image_key
- `cart_items` — id, user_id, restaurant_slug, item_id, quantity
- `orders` — id, user_id, total_price, created_at

Note: The schema is intentionally compact for demo purposes. Adjust indexes, FK constraints, and types for production.

## Secrets management

- Secrets are stored as Base64-encoded Kubernetes Secrets (for the Helm chart they are shipped in `app-secret.yaml` in the reference).
- Secrets referenced in deployments via `envFrom.secretRef`.
- Recommended production approach: use AWS Secrets Manager / SSM Parameter Store or External Secrets Operator (avoid storing plaintext secrets in Git).

Secrets to provide:

- `DB_USER` and `DB_PASS`
- Any third-party keys (S3, CloudFront, etc.) required by the deployment pipeline

## CI/CD flow

- Jenkins (reference):
  1. Checkout code
  2. Build container images
  3. Push to ECR
  4. Update `infra-repo` (values) or trigger ArgoCD sync
  5. Clean workspace

- ArgoCD: watches `infra-repo` and applies Helm charts to EKS as changes appear.

You can replace Jenkins with GitHub Actions or other CI systems using the same steps (build -> push -> update infra repo / trigger GitOps).

## Kubernetes resources (what the Helm chart creates)

- Deployments (one per service) with resource requests/limits
- Services (ClusterIP) and Ingress (ALB) for external access
- Horizontal Pod Autoscalers (HPA) for CPU-based scaling
- ConfigMaps and Secrets for configuration

Recommended HPA settings (example): minReplicas: 2, maxReplicas: 5, targetCPUUtilizationPercentage: 70

## Scaling & performance

- Use HPA to autoscale pods on CPU usage.
- Use spot instances for cost optimization; keep a mix of on-demand for reliability.
- Cache static assets via CloudFront.
- Use RDS read replicas if read-heavy workloads appear.

## Troubleshooting & common issues

- Pod CrashLoopBackOff: inspect logs `kubectl logs <pod>` and check environment variables for missing secrets.
- DB connectivity issues: ensure RDS is reachable from EKS (security groups, subnet routing, NAT if needed).
- Image pull errors: confirm ECR permissions and that the image tag exists.
- ArgoCD not syncing: check ArgoCD App status and repository credentials.

Quick debugging commands:

```powershell
# Check pods
kubectl get pods -n food-delivery

# View logs
kubectl logs deploy/restaurant-service -n food-delivery

# Describe failing pod
kubectl describe pod <pod-name> -n food-delivery
```

## Future enhancements

- Add `user-service` for authentication and user management
- Integrate Prometheus + Grafana for metrics and alerts
- Use AWS Secrets Manager / External Secrets Operator for secret rotation
- End-to-end tests and canary deployments
- Replace Jenkins with GitHub Actions for a cloud-native pipeline (optional)

###

Connect with me on [LinkedIn](https://www.linkedin.com/in/sauravqa/) - happy to answer questions or demo the deployment.