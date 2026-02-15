Front (Vanilla) — Docker + Kubernetes

Files added:
- `front/Dockerfile` — builds an nginx image with your static files (copy your static site into this folder or mount the `back/public` contents when building).
- `k8s/frontend-deployment.yaml` — Deployment (2 replicas), Service, optional Ingress.

Quick steps

1) Prepare static files

- Option A: build image from `front` folder (copy your static files into `front` first). If your static site is in `back/public`, you can copy them:

```bash
cp -r back/public/* front/
```

2) Build and push image (replace registry and tag)

```bash
# from repo root
docker build -t your-registry/patrones-frontend:latest ./front
docker push your-registry/patrones-frontend:latest
```

3) Edit `k8s/frontend-deployment.yaml` and replace `your-registry/patrones-frontend:latest` with your pushed image.

4) Apply to cluster

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

5) (Optional) If you used the Ingress rule, set the DNS for `frontend.example.com` to your ingress controller IP or edit the hosts file for testing.

Notes
- The YAML sets readiness/liveness probes and 2 replicas by default. Add resource requests/limits if you run on a shared cluster.
- If you want me to add an automated GitHub Actions workflow to build and push the image, I can add one.
