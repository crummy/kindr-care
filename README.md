# Kindr Care

Static Astro site for Kindr, configured for Cloudflare Pages hosting.

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

## Cloudflare Pages

Connect the GitHub repository `crummy/kindr-care` to Cloudflare Pages with:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Project name: `kindr-care`

The repo includes `wrangler.jsonc` with `pages_build_output_dir` set to `./dist`. Keep Cloudflare Pages project settings aligned with that file.

Future form submission handlers can be added as Cloudflare Pages Functions under `functions/`. For example, `functions/api/contact.ts` will route to `/api/contact`.

## Deployment

Cloudflare should build and deploy automatically when `main` is pushed:

```sh
git push origin main
```

For an authenticated manual deploy from a local checkout:

```sh
npm run pages:deploy
```
