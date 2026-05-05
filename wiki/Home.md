---
title: Home
tags: [wiki, index]
---

# mkontsek.github.io

> One-liner: personal GitHub Pages site for Martin Kontsek, with a static homepage and browser-based Gomoku game.

## Why this wiki exists

This folder is a small, agent-readable knowledge base. It is editable as an [Obsidian](https://obsidian.md) vault — every file is plain Markdown, and `[[wiki-links]]` are supported. Humans **and** AI assistants should read it before making non-trivial changes, and update it when architecture, domain, or operations change.

## Map

- [[Architecture]] — services, packages, data flow, integration points.
- [[Domain]] — vocabulary, entities, business rules.
- [[Decisions]] — ADR-style log of "why we did it this way".
- [[Operations]] — local setup, deploys, observability, on-call.
- [[Conventions]] — project-specific rules beyond `wiki/skills/`.

## Status

- Current focus: keep the static homepage and Gomoku game small, dependency-free, and easy to publish through GitHub Pages.
- Known sharp edges: there is no package manifest or automated check suite; validate with browser smoke tests and JavaScript syntax checks.
- Owner / point of contact: Martin Kontsek.

## How to update

- Add notes anywhere, in any structure that is helpful. Subfolders are fine.
- Prefer short pages with `[[wiki-links]]` over one giant page.
- When the code drifts from the wiki, the **wiki is wrong** — fix it.
- Do not store secrets or production credentials here.
