# Deploying SilkRoot backend (Docker Hub + Render)

Overview
- GitHub Action will build the backend Docker image from `backend/Dockerfile` and push it to Docker Hub.
- After pushing, the workflow calls Render's API to trigger a deploy of your Render service.

Required GitHub repository secrets
- `DOCKERHUB_USERNAME` — your Docker Hub username
- `DOCKERHUB_TOKEN` — Docker Hub access token (or password)
- `RENDER_SERVICE_ID` — Render service id (found in Render dashboard URL or API)
- `RENDER_API_KEY` — Render API key (Service or API Key with deploy permission)

How to use
1. Create a Docker Hub repository (e.g., `yourusername/e-commerce`).
2. Add the secrets above to your GitHub repository (Settings → Secrets → Actions).
3. If you prefer to use Render's GitHub integration, create a new Web Service and point it at this repository and `main` branch (or use the `render.yaml` manifest).
4. If you created a Render service that deploys from Docker image, set `RENDER_SERVICE_ID` and `RENDER_API_KEY` so the workflow can trigger deploys.

Notes & options
- If you prefer GHCR instead of Docker Hub, the workflow can be adjusted to push to GitHub Container Registry.
- I can also add a workflow that handles frontend build and publishes a static site if you'd like.

Need help
- Tell me your Docker Hub repository name and whether you want me to change the workflow to push to a different tag scheme or registry.
- If you want, I can help create the Render service (requires your Render account access) or provide step-by-step instructions to set it up.