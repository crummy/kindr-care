# Kindr Care

Static Astro site for Kindr, configured for Cloudflare Workers static-assets hosting.

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run build
npm audit --omit=dev
```

## Cloudflare Workers

Connect the GitHub repository `crummy/kindr-care` to a Cloudflare Workers project with:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Project name: `kindr-care`

The repo includes `wrangler.jsonc` with `assets.directory` set to `./dist`. This is what `wrangler deploy` uses to upload the static Astro build.

Future form submission handlers can be added by introducing a Worker script and routing API requests there while continuing to serve static assets from `dist`.

## Deployment

Cloudflare should build and deploy automatically when `main` is pushed:

```sh
git push origin main
```

For an authenticated manual deploy from a local checkout:

```sh
npm run workers:deploy
```
