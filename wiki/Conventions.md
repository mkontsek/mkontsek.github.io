---
title: Conventions
tags: [wiki, conventions]
---

# Conventions

> Project-specific conventions that go **beyond** what's in `.github/copilot-instructions.md` and `wiki/skills/`. If a rule is generic, put it in the skill files. If it is specific to this codebase, put it here.

## Naming

- Root-level static page files use descriptive lowercase names (`index.html`, `gomoku.html`, `gomoku.js`, `gomoku.css`).
- Preserve existing DOM IDs used by `gomoku.js` unless the JavaScript is updated in the same change.

## Folder rules

- Keep static site assets at the repository root for GitHub Pages compatibility.
- Keep project knowledge in `wiki/`; do not replace it with a single README.
- Avoid committing editor-specific state; `.idea/` and `*.iml` are ignored.

## Patterns we keep

- Prefer dependency-free browser JavaScript for small interactive features.
- Use relative links for local assets and pages.
- Keep `localStorage` keys stable when changing saved Gomoku state.
- Keep validation dependency-free unless the project adopts a package manager; use `scripts/check-static-site.py` and `.githooks/pre-commit` for lint, format, test, and build-equivalent gates.

## Patterns we have rejected

- No rejected patterns have been recorded yet.

## Open questions

- Whether to keep the legacy Hugo-generated metadata/credits in `index.html` or regenerate the site from source.

## Related

- [[Architecture]]
- [[Decisions]]
- `.github/copilot-instructions.md`
- `wiki/skills/`
