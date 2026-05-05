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

## 2026-05-05 — Wiki added

- Context: agents and humans needed a place to record project-specific knowledge that does not belong in the code or in `wiki/skills/`.
- Decision: keep an Obsidian-compatible Markdown wiki at `wiki/` in the project root.
- Alternatives rejected: a single `ARCHITECTURE.md`, an external Notion/Confluence page, an in-code doc folder under `docs/`.
- Consequences: the wiki must be kept in sync as the code evolves; agents are instructed to update it via `wiki/skills/wiki.md`.
- Status: accepted.
