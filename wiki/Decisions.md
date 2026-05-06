---
title: Decisions
tags: [wiki, adr]
---

# Decisions

> Lightweight ADR log. One entry per non-obvious choice. Keep entries small — link out for detail.

## Format

```
## YYYY-MM-DD — <short title>
- Context: what forced the decision.
- Decision: what we chose.
- Alternatives: what we rejected and why.
- Consequences: what becomes harder / easier as a result.
- Status: accepted | superseded by [[#YYYY-MM-DD — ...]]
```

## Log

<!-- newest first -->

## 2026-05-05 — Dependency-free commit validation

- Context: commits need local gates for lint, format, test, and build intent, but this GitHub Pages site has no package manager, generated build, or unit test runner.
- Decision: add a tracked `.githooks/pre-commit` that runs `scripts/check-static-site.py`, keeping validation in Python and Node already used for JavaScript syntax checks.
- Alternatives rejected: adding npm, Prettier, ESLint, or a test framework only for hooks; relying on untracked `.git/hooks`; validating by manual browser checks only.
- Consequences: contributors must run `git config core.hooksPath .githooks` once per clone; validation remains lightweight and dependency-free, with documented N/A categories for unsupported tooling.
- Status: accepted.

## 2026-05-05 — Wiki added

- Context: agents and humans needed a place to record project-specific knowledge that does not belong in the code or in `wiki/skills/`.
- Decision: keep an Obsidian-compatible Markdown wiki at `wiki/` in the project root.
- Alternatives rejected: a single `ARCHITECTURE.md`, an external Notion/Confluence page, an in-code doc folder under `docs/`.
- Consequences: the wiki must be kept in sync as the code evolves; agents are instructed to update it via `wiki/skills/wiki.md`.
- Status: accepted.
