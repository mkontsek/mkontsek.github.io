#!/usr/bin/env python3
"""Dependency-free validation gates for this static GitHub Pages site."""

from __future__ import annotations

import contextlib
import html.parser
import shutil
import subprocess
import sys
import threading
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = sorted(ROOT.glob("*.html"))
JS_FILES = sorted(ROOT.glob("*.js"))
CSS_FILES = sorted(ROOT.glob("*.css"))
TEXT_SUFFIXES = {".css", ".html", ".js", ".json", ".md", ".py", ".sh", ".svg", ".txt", ".yml", ".yaml"}
VOID_TAGS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
OPTIONAL_CLOSE_TAGS = {"body", "head", "html", "li", "p", "td", "th", "tr"}
SKIPPED_DIRS = {".git", ".idea", "node_modules"}


class QuietStaticHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        return


class StaticHTMLParser(html.parser.HTMLParser):
    def __init__(self, path: Path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.errors: list[str] = []
        self.stack: list[tuple[str, int]] = []
        self.references: list[tuple[str, str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        line, _ = self.getpos()
        attr_names = [name.lower() for name, _ in attrs]
        duplicates = sorted({name for name in attr_names if attr_names.count(name) > 1})
        if duplicates:
            self.errors.append(f"{self.path.name}:{line}: duplicate attributes: {', '.join(duplicates)}")

        for name, value in attrs:
            if value is not None and name.lower() in {"href", "src"}:
                self.references.append((name.lower(), value, line))

        lowered = tag.lower()
        if lowered not in VOID_TAGS:
            self.stack.append((lowered, line))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]):
        line, _ = self.getpos()
        attr_names = [name.lower() for name, _ in attrs]
        duplicates = sorted({name for name in attr_names if attr_names.count(name) > 1})
        if duplicates:
            self.errors.append(f"{self.path.name}:{line}: duplicate attributes: {', '.join(duplicates)}")

        for name, value in attrs:
            if value is not None and name.lower() in {"href", "src"}:
                self.references.append((name.lower(), value, line))

    def handle_endtag(self, tag: str):
        lowered = tag.lower()
        if lowered in VOID_TAGS:
            return

        line, _ = self.getpos()
        if not self.stack:
            self.errors.append(f"{self.path.name}:{line}: unexpected closing </{lowered}>")
            return

        open_tag, open_line = self.stack.pop()
        if open_tag == lowered:
            return

        if open_tag in OPTIONAL_CLOSE_TAGS:
            while self.stack:
                candidate, candidate_line = self.stack.pop()
                if candidate == lowered:
                    return
                if candidate not in OPTIONAL_CLOSE_TAGS:
                    self.errors.append(
                        f"{self.path.name}:{line}: closing </{lowered}> does not match "
                        f"<{candidate}> opened on line {candidate_line}"
                    )
                    return

        self.errors.append(
            f"{self.path.name}:{line}: closing </{lowered}> does not match "
            f"<{open_tag}> opened on line {open_line}"
        )

    def close(self):
        super().close()
        for tag, line in reversed(self.stack):
            if tag not in OPTIONAL_CLOSE_TAGS:
                self.errors.append(f"{self.path.name}:{line}: unclosed <{tag}>")


def print_step(name: str, detail: str):
    print(f"[{name}] {detail}")


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def text_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        if any(part in SKIPPED_DIRS for part in path.relative_to(ROOT).parts):
            continue
        files.append(path)
    return sorted(files)


def local_target(raw_value: str, base_dir: Path = ROOT) -> Path | None:
    value = raw_value.strip()
    if not value or value.startswith("#"):
        return None

    parsed = urllib.parse.urlparse(value)
    if parsed.scheme or parsed.netloc:
        return None

    path = urllib.parse.unquote(parsed.path)
    if not path:
        return None

    if path.startswith("/"):
        return ROOT / path.lstrip("/")

    return base_dir / path


def parse_html() -> tuple[list[StaticHTMLParser], list[str]]:
    parsers: list[StaticHTMLParser] = []
    errors: list[str] = []
    for path in HTML_FILES:
        parser = StaticHTMLParser(path)
        try:
            parser.feed(path.read_text(encoding="utf-8"))
            parser.close()
        except html.parser.HTMLParseError as exc:
            errors.append(f"{path.name}:{exc.lineno}: {exc.msg}")
        except UnicodeDecodeError as exc:
            errors.append(f"{path.name}: not valid UTF-8: {exc}")
        errors.extend(parser.errors)
        parsers.append(parser)
    return parsers, errors


def validate_html_references(parsers: list[StaticHTMLParser]) -> list[str]:
    errors: list[str] = []
    for parser in parsers:
        for attr, value, line in parser.references:
            target = local_target(value, parser.path.parent)
            if target is not None and not target.exists():
                errors.append(f"{parser.path.name}:{line}: {attr} points to missing local file: {value}")
    return errors


def validate_js_syntax() -> list[str]:
    if not JS_FILES:
        return []

    node = shutil.which("node")
    if node is None:
        return ["node is required for JavaScript syntax checks, but it was not found on PATH"]

    errors: list[str] = []
    for path in JS_FILES:
        result = subprocess.run(
            [node, "--check", str(path)],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode != 0:
            output = (result.stderr or result.stdout).strip()
            errors.append(f"{rel(path)} failed node --check\n{output}")
    return errors


def validate_css_balance() -> list[str]:
    errors: list[str] = []
    for path in CSS_FILES:
        text = path.read_text(encoding="utf-8")
        depth = 0
        in_comment = False
        quote: str | None = None
        escaped = False
        for index, char in enumerate(text):
            next_char = text[index + 1] if index + 1 < len(text) else ""
            if in_comment:
                if char == "*" and next_char == "/":
                    in_comment = False
                continue
            if quote is not None:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == quote:
                    quote = None
                continue
            if char == "/" and next_char == "*":
                in_comment = True
            elif char in {"'", '"'}:
                quote = char
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth < 0:
                    errors.append(f"{rel(path)}: unexpected closing brace")
                    depth = 0
        if in_comment:
            errors.append(f"{rel(path)}: unclosed CSS comment")
        if quote is not None:
            errors.append(f"{rel(path)}: unclosed CSS string")
        if depth != 0:
            errors.append(f"{rel(path)}: unbalanced CSS braces")
    return errors


def validate_formatting() -> list[str]:
    errors: list[str] = []
    for path in text_files():
        try:
            lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
        except UnicodeDecodeError as exc:
            errors.append(f"{rel(path)}: not valid UTF-8: {exc}")
            continue
        for line_number, line in enumerate(lines, start=1):
            body = line.rstrip("\r\n")
            if body.rstrip(" \t") != body:
                errors.append(f"{rel(path)}:{line_number}: trailing whitespace")
    return errors


def smoke_static_server(parsers: list[StaticHTMLParser]) -> list[str]:
    paths = {"/", "/index.html"}
    for html_file in HTML_FILES:
        paths.add(f"/{html_file.name}")
    for parser in parsers:
        for _, value, _ in parser.references:
            target = local_target(value, parser.path.parent)
            if target is not None and target.is_file():
                paths.add("/" + rel(target))

    httpd = ThreadingHTTPServer(("127.0.0.1", 0), QuietStaticHandler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    port = httpd.server_address[1]
    errors: list[str] = []
    try:
        for path in sorted(paths):
            url = f"http://127.0.0.1:{port}{urllib.parse.quote(path)}"
            try:
                with urllib.request.urlopen(url, timeout=5) as response:
                    if response.status != 200:
                        errors.append(f"GET {path} returned HTTP {response.status}")
            except (urllib.error.URLError, TimeoutError) as exc:
                errors.append(f"GET {path} failed: {exc}")
    finally:
        httpd.shutdown()
        httpd.server_close()
        thread.join(timeout=5)
    return errors


def report_errors(errors: list[str]) -> int:
    if not errors:
        return 0

    print("\nValidation failed:", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)
    return 1


def main() -> int:
    if not HTML_FILES:
        return report_errors(["no root HTML entry points found"])

    errors: list[str] = []

    print_step("lint", "HTML parsing, local HTML asset references, CSS balance, and JS syntax")
    parsers, html_errors = parse_html()
    errors.extend(html_errors)
    errors.extend(validate_html_references(parsers))
    errors.extend(validate_css_balance())
    errors.extend(validate_js_syntax())

    print_step("format", "Prettier is N/A (no package manager); checking dependency-free whitespace hygiene")
    errors.extend(validate_formatting())

    print_step("test", "No unit test runner configured; running static server smoke checks")
    errors.extend(smoke_static_server(parsers))

    print_step("build", "No build step for GitHub Pages static files; smoke checks are the build-equivalent gate")

    if errors:
        return report_errors(errors)

    print("All static-site validation gates passed.")
    return 0


if __name__ == "__main__":
    with contextlib.suppress(KeyboardInterrupt):
        sys.exit(main())
    sys.exit(130)
