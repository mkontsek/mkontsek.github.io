---
title: Architecture
tags: [wiki, architecture]
---

# Architecture

> What the system looks like from 10,000 ft. Keep this honest — if it diverges from the code, fix the wiki.

## Shape

Static GitHub Pages site with no package manager or application framework. The entry points are `index.html` for the personal homepage and `gomoku.html` for the standalone Gomoku game. Styling lives in `main.css` and `gomoku.css`; game behavior lives in `gomoku.js`.

## Components

| Component | Path | Purpose | Notes |
|---|---|---|---|
| Homepage | `index.html`, `main.css` | Terminal-inspired personal landing page, contact links, and links to the game/README. | `main.css` is generated/minified theme CSS and should be edited cautiously. |
| Gomoku game | `gomoku.html`, `gomoku.css`, `gomoku.js` | Browser-only endless five-in-a-row game with an expanding grid and local score state. | Persists moves in `localStorage` under `endlessGomoku`. |
| Static assets | `*.woff2`, `*.ttf`, `*.svg` | Fonts and images loaded directly by the pages. | Keep paths relative for GitHub Pages. |

## Data flow

```text
browser → GitHub Pages static file → HTML/CSS/JS
gomoku.js → DOM updates → localStorage (saved game only)
```

## External dependencies

- GitHub Pages serves the static files.
- `index.html` loads `flag-icon-css` from CDNJS for legacy theme styling.
- No backend APIs, databases, queues, or server-side secrets are used.

## Boundaries to respect

- Keep the homepage static and avoid introducing a build step unless there is a clear need.
- Keep Gomoku state client-side only; do not add server persistence or credentials.
- Keep asset references relative so the site works from the GitHub Pages root.

## Related

- [[Domain]]
- [[Decisions]]
