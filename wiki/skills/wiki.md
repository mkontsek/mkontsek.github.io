# Wiki Skill

## Scope

Every project in this set ships an in-repo wiki at `wiki/` (project root). It is a small, **Obsidian-compatible** Markdown vault — every file is plain `.md`, `[[wiki-links]]` resolve inside the folder, no plugins required. Agents must treat it as a first-class source of project knowledge alongside `.github/copilot-instructions.md` and the other skill files.

## Files you will find

Default layout (most projects):

- `wiki/Home.md` — entry point + map of the wiki.
- `wiki/Architecture.md` — components, data flow, boundaries.
- `wiki/Domain.md` — vocabulary, entities, business rules.
- `wiki/Decisions.md` — ADR-style log of "why we did it this way".
- `wiki/Operations.md` — local setup, deploys, runbooks.
- `wiki/Conventions.md` — project-specific rules beyond `wiki/skills/`.

Subfolders and additional pages are allowed.

**Per-project override:** if `wiki/AGENTS.md` or `wiki/README.md` exists, read it first — that project uses its own wiki conventions and you must follow them instead of the default layout.

## When to read the wiki

Read **before** you act, not after, in any of these cases:

- The task is non-trivial (more than a single small edit).
- The task touches architecture, public APIs, data models, or cross-package boundaries.
- The user uses a domain term you are not certain of — check `Domain.md`.
- You are about to introduce a new pattern, library, or service — check `Decisions.md` and `Conventions.md` first to make sure it has not already been considered and rejected.
- You need to run, deploy, or debug — check `Operations.md` before guessing.

If a wiki page is empty or marked `{{TODO}}`, fall back to reading the code, but note the gap so it can be filled.

## When to update the wiki

Update **as part of the same change**, not as a follow-up:

- You change architecture, package boundaries, or data flow → update `Architecture.md`.
- You introduce or rename a domain concept → update `Domain.md`.
- You make a non-obvious choice (new lib, new pattern, deviation from a default) → add an entry to `Decisions.md` with date, context, decision, alternatives, consequences.
- You change how the project is run / deployed / observed → update `Operations.md`.
- You establish a new project-specific convention → update `Conventions.md`.

If the wiki contradicts the code, **the wiki is wrong** — fix it in the same PR.

## Quality gate documentation

- Every non-legacy project must document and keep a tracked pre-commit hook that runs `lint`, `prettier`/`format`, `test`, and `build` before commit.
- If a category is genuinely unavailable (for example a static site without a test runner), the hook and wiki must run the closest equivalent validation and document the N/A category explicitly.

## How to write wiki entries

- Markdown only. No HTML, no plugin-specific syntax. Frontmatter (`---` blocks) is allowed.
- `[[wiki-links]]` are preferred over relative paths for cross-page links inside `wiki/`.
- Use code-relative paths (e.g. `apps/web/src/lib/foo.ts`) when pointing at code, not wiki-links.
- Keep pages short. Split rather than grow past ~200 lines.
- Date ADR entries (`Decisions.md`) in `YYYY-MM-DD`, newest first.
- Do not commit secrets, tokens, or production credentials. Operational secrets stay in your secret manager; the wiki only describes _where_ to find them.

## Hard rules

- Never delete history from `Decisions.md`. Supersede entries; do not remove them.
- Never replace the wiki with a single README. The split is intentional.
- Never load `.obsidian/`-specific config into the repo unless the user asks — it is per-user state.
