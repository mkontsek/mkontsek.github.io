# Git Commit Instructions

### Workflow & Commits

- **Branching**: Use `<type>/<ticket-number>` (e.g., `feat/XXX-1234`).
- type is one of 'refactor', 'feat', 'test', 'chore', 'fix'
- **Commit Messages**:
    - Format: `<type>: <ticket-number> <description>` (e.g., `feat: XXX-12345 add new field`).
    - Follow Conventional Commits.
- **Pull Requests**:
    - **Rebase** onto `main` (DO NOT merge `main` into your branch).
    - Merge via `merge please` comment.
    - Max PR size is around 300 lines of code. If you exceed this, split into multiple PRs.
