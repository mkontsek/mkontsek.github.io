---
title: Operations
tags: [wiki, runbook]
---

# Operations

> Everything you need to actually run, deploy, and debug this project. Short, command-first. No prose where a snippet will do.

## Local setup

```bash
# No install step is required.
cd /Users/mkontsek/gitrepos/mkontsek.github.io
```

## Run / dev loop

```bash
python3 -m http.server 3018
# Open http://localhost:3018/ and http://localhost:3018/gomoku.html
```

## Tests & checks

```bash
python3 scripts/check-static-site.py
```

The validation gate covers:

- Lint: root HTML parsing, local HTML asset references, CSS balance, and `node --check` for JavaScript syntax.
- Format / Prettier: Prettier is not configured because the repo has no package manager; trailing-whitespace checks provide dependency-free formatting coverage.
- Test: no unit test runner exists; static server smoke checks cover page and direct asset availability.
- Build: no build step is required for GitHub Pages; smoke checks are the build-equivalent gate.

Enable the tracked pre-commit hook locally:

```bash
git config core.hooksPath .githooks
```

## Deploy

Ships through GitHub Pages from the repository contents. No deployment secrets are required for the static site.

## Observability

- Logs: none in the application.
- Metrics / dashboards: none configured.
- Alerts: none configured.

## Common breakages

| Symptom | Likely cause | Fix |
|---|---|---|
| Gomoku state looks wrong | Stale `localStorage` value | Click reset or clear `endlessGomoku` in browser storage. |
| Asset 404s on GitHub Pages | Broken relative path or missing checked-in asset | Verify the file exists at the repo root and use a relative URL. |

## Secrets

- Where they live: no application secrets are used.
- How to rotate: not applicable until a service with secrets is introduced.

## Related

- [[Architecture]]
- [[Conventions]]
