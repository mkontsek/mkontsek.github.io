# mkontsek.github.io

Personal website of Martin Kontsek, a Software Engineer specializing in Web tech, Remote viewing, and Consultant services.

## About

This repository contains the source for my personal website hosted on GitHub Pages. The checked-in site is static HTML, CSS, JavaScript, fonts, and SVG assets with a clean, terminal-inspired design.

There is currently no package manager, build step, or test runner in this repo. Validate changes by opening the static pages locally or serving the directory with a simple static file server.

## Features

- **Homepage**: Introduction and contact information.
- **Gomoku Game**: Play a large-grid endless-point five-in-a-row game (also known as GOMOKU) directly in the browser.

## Local development

```bash
python3 -m http.server 3018
# Open http://localhost:3018/ and http://localhost:3018/gomoku.html
```

## Validation and pre-commit hooks

This static site intentionally has no package manager, npm scripts, or build step.
Use the dependency-free validation gate before committing:

```bash
python3 scripts/check-static-site.py
```

Enable the tracked pre-commit hook locally so commits run the same gate:

```bash
git config core.hooksPath .githooks
```

The hook covers the usual categories as follows:

- **Lint**: parses root HTML files, checks local HTML asset references, verifies CSS brace/comment/string balance, and runs `node --check` for JavaScript syntax.
- **Format / Prettier**: Prettier is N/A because the repo has no package manager; the hook enforces dependency-free trailing-whitespace checks.
- **Test**: no unit test runner exists; the hook runs static server smoke checks for the pages and direct local assets.
- **Build**: no generated build is required for GitHub Pages; the smoke checks are the build-equivalent gate.

## Links

- **Email**: mvk@sabercrown.com
- **GitHub**: [https://github.com/mkontsek/](https://github.com/mkontsek/)
- **Sabercrown**: [https://sabercrown.com/](https://sabercrown.com/)
- **Live Site**: [https://mkontsek.github.io/](https://mkontsek.github.io/)

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

## Credits

Made with ♥ by [Djordje Atlialp](https://www.djordjeatlialp.de/).
