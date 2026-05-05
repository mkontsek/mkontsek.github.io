---
title: Domain
tags: [wiki, domain, glossary]
---

# Domain

> The vocabulary of this project. When the code uses a term, it should mean what is written here. When it doesn't, fix the code or fix the page.

## Glossary

| Term | Meaning | Where it lives in code |
|---|---|---|
| Homepage | Personal landing page with professional summary and outbound links. | `index.html` |
| Gomoku | Endless five-in-a-row browser game. | `gomoku.html`, `gomoku.js` |
| Game move | A placed `x` or `o` marker at an `{x, y}` grid coordinate. | `gomoku.js` |
| Combo | Five contiguous markers for one player in a horizontal, vertical, or diagonal line. | `gomoku.js` |

## Core entities

The homepage is a static personal profile. The Gomoku game is a separate static page whose core entities are cells, moves, players (`x` and `o`), combos, and scores. Moves are stored in the browser so a visitor can resume the current local game.

## Business rules

- A cell can only be claimed once.
- Players alternate after each valid move.
- A combo scores when five contiguous cells belong to the same player.
- Saved game state must remain browser-local and must not require a backend.

## Out of scope

- No authentication, accounts, multiplayer service, analytics pipeline, or database.
- No build system is required for the current static site.

## Related

- [[Architecture]]
- [[Decisions]]
