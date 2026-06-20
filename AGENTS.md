# AI Agent Rules

This is a small Astro site for Kindr. Keep the codebase intentionally simple.

## Stack

- Use Astro for pages, layouts, and components.
- Use modern TypeScript for shared data and client-side scripts.
- Prefer static rendering and plain HTML/CSS.
- Keep styles in `src/styles/global.css` unless a component-specific file becomes clearly necessary.

## Dependencies

- Do not add external packages unless there is a concrete need and no simple platform or Astro-native option.
- If a package is necessary, document why in the pull request or commit message.
- Avoid UI frameworks, CSS frameworks, state libraries, and animation libraries for this site.

## Implementation

- Keep page content in typed data files under `src/content` when it is repeated or likely to change.
- Prefer accessible HTML elements over custom controls.
- Keep JavaScript small and progressive. The site should still show its core content without JavaScript.
- Use project-local assets in `public/images`.
- Do not introduce a backend unless the business workflow explicitly requires one.

## Validation

- Run `npm run build` before handing off changes.
- Check mobile and desktop layout when changing major sections or navigation.
