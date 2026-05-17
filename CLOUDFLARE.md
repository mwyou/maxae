# Cloudflare Workers + D1

This is the deployment path for MAXAE. It avoids MySQL remote access entirely and keeps static assets, API routes, and D1 access in one Worker.

## Architecture

- Frontend: Vite build output in `dist`
- Admin page: `public/admin.html`, copied into `dist/admin.html`
- API: Cloudflare Worker in `worker/index.js`
- Static assets: Workers Assets binding `ASSETS`
- Database: Cloudflare D1 bound as `DB`
- Images: external image-bed URLs stored in D1

## Create D1

```bash
npx wrangler login
npx wrangler d1 create maxae
```

Copy the returned `database_id` into `wrangler.toml`.

## Admin Setup

Open `/admin.html` after deployment. If no administrator exists, the page will show a first-run setup form and create the admin account inside D1.

The D1 `database_id` cannot be changed from the admin page. It must stay bound in `wrangler.toml` or the Cloudflare Workers project settings.

## Apply Migrations

Local:

```bash
npm run cf:migrate:local
```

Remote:

```bash
npm run cf:migrate:remote
```

## Local Dev

```bash
npm run cf:dev
```

Then open the URL printed by Wrangler and visit `/admin.html`.

## Deploy

```bash
npm run build
npx wrangler deploy
```

## GitHub Actions Deploy

The repo includes:

```text
.github/workflows/deploy-cloudflare.yml
```

Add these GitHub repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

On every push to `main`, GitHub Actions will:

1. Install dependencies with `npm ci`
2. Build the frontend with `npm run build`
3. Apply D1 migrations with `wrangler d1 migrations apply maxae --remote`
4. Deploy the Worker with static assets using `wrangler deploy`

You can also trigger it manually from the GitHub Actions tab using `workflow_dispatch`.

The API will be available under:

```text
/api/health
/api/public/categories
/api/public/categories/:slug
/api/public/categories/:slug/artworks
/api/auth/login
/api/admin/categories
/api/admin/artworks
```
