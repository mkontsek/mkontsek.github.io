# Development Guidelines for Copilot

> **About this file (v2.1.0):** Lean, always-loaded guidance. Detailed implementation rules live in skill files **inside the wiki**.
>
> **Architecture:**
>
> -   `.github/copilot-instructions.md` (this file): core philosophy + cross-cutting constraints.
> -   `wiki/skills/`: detailed stack-specific rules:
>     -   `wiki.md`
> -   `wiki/`: Obsidian-compatible Markdown knowledge base (architecture, domain, decisions, ops, conventions). See `wiki/skills/wiki.md`.
>
> **Agents: read `wiki/skills/` before any non-trivial change.** Skill files there are authoritative; this file only summarises.

## Interaction Style

Before planning, quickly confirm requirements, constraints, and acceptance criteria.

During execution, if a design choice materially affects DX, performance, or safety, present options with trade-offs and ask which path to take.

## Cross-cutting Rules

-   Naming:
    -   `kebab-case` for folders/packages/data-cy.
    -   `camelCase` for variables/functions/hooks.
    -   `PascalCase` for React components/types/classes.
    -   `UPPER_CASE` for constants.
-   Control flow:
    -   Always use braces for `if` blocks.
    -   Prefer early returns over `if/else` nesting.
-   File size:
    -   Max **300 lines** for `.ts`, `.tsx`, and `.rs` source files.
    -   Test files are excluded.
-   Function naming:
    -   Do not use `handle*` prefixes.
    -   Reserve `on*` prefix exclusively for props.
-   Imports:
    -   Prefer relative imports inside a package/crate.
-   Security:
    -   Sanitize untrusted input before HTML/SQL/shell usage.
    -   Never log secrets or full tokens.

## Project Wiki (Summary)

Authoritative details: `wiki/skills/wiki.md`

-   This project ships a Markdown wiki at `wiki/` (Obsidian-compatible vault).
-   Read it before non-trivial changes — especially `Architecture.md`, `Domain.md`, `Decisions.md`, `Conventions.md`.
-   Update it as part of the same change when architecture, domain, ops, or conventions shift. The wiki is wrong, not the code.
-   If `wiki/AGENTS.md` or `wiki/README.md` exists, that project uses its own layout — follow it.

## Workflow & Commits

-   Branch naming: `<type>/<ticket-number>` where type is one of `refactor|feat|test|chore|fix`.
-   Commit format: `<type>: <ticket-number> <description>` (Conventional Commit semantics).
-   Use pre-commit hooks that run `lint`, `test`, and `build` before commit.
-   Rebase on `main` before PR; do not merge `main` into feature branches.
-   Keep PRs focused and reasonably small; split large changes when needed.

## Living Documentation

Skill files should evolve from repeated feedback and real patterns.

-   Propose focused updates to the relevant skill file.
-   Keep each proposed update scoped to one concern.
-   Wait for approval before treating a new pattern as canonical.
