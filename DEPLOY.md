# Deploy API to Coolify

The API is deployed from this repository with Coolify’s **Dockerfile** build pack (no Docker Hub publish step).

## Coolify application setup

1. **New resource** → Git repository → `Yaroshenko-tools/api`
2. **Branch:** `production` or `master` (both have the same Dockerfile after the Coolify update)
3. **Build pack:** Dockerfile at repo root — do **not** paste a custom Dockerfile in Coolify
4. **Do not** put secrets in Docker build args (`BITLY_SECRET`, `VK_CC_ACCESS_TOKEN` belong in **Environment Variables** only)
5. **Port:** `3000`
6. **Domain:** e.g. `https://api.yaroshenko.tools`
7. **Environment variables** (from `.env.example`):

   | Variable | Description |
   |----------|-------------|
   | `PORT` | Optional; defaults to `3000` |
   | `BITLY_SECRET` | Bitly API token |
   | `VK_CC_ACCESS_TOKEN` | VK shortener token |
   | `APP_FRONTEND_URL` | Public frontend URL (CORS), e.g. `https://yaroshenko.tools` |
   | `LOKI_HOST`, `LOKI_USER`, `LOKI_PASS` | Optional logging |

8. Enable **Auto Deploy** on push (GitHub App or deploy webhook).

## Health check

Coolify can use path `/` — the app responds with `200` and `"It works"`.

## Local build

```bash
docker build -t yaroshenko-api .
docker run --rm -p 3000:3000 --env-file .env yaroshenko-api
```

## Migration note

Deployment no longer uses GitHub Actions to push images to Docker Hub. Coolify builds the image on your server from this repo.
