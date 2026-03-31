from __future__ import annotations

import argparse
import re
from pathlib import Path


ROOT = Path("data/sec_10k")


START_HEADING_PATTERNS = [
    re.compile(r"^forward-looking statements$", re.IGNORECASE),
    re.compile(r"^company background$", re.IGNORECASE),
    re.compile(r"^overview and executive summary$", re.IGNORECASE),
    re.compile(r"^overview$", re.IGNORECASE),
    re.compile(r"^business$", re.IGNORECASE),
    re.compile(r"^risk factors$", re.IGNORECASE),
    re.compile(r"^business and strategic risks$", re.IGNORECASE),
    re.compile(r"^management[’'`s ]+discussion and analysis", re.IGNORECASE),
    re.compile(r"^item\s*1\.?\s*business", re.IGNORECASE),
    re.compile(r"^item\s*1a\.?\s*risk factors", re.IGNORECASE),
    re.compile(r"^item\s*7\.?", re.IGNORECASE),
]

END_HEADING_PATTERNS = [
    re.compile(r"^financial statements and supplementary data$", re.IGNORECASE),
    re.compile(r"^notes to consolidated financial statements$", re.IGNORECASE),
    re.compile(r"^report of independent registered public accounting firm$", re.IGNORECASE),
    re.compile(r"^to the shareholders and the board of directors", re.IGNORECASE),
    re.compile(r"^consolidated statements? of ", re.IGNORECASE),
    re.compile(r"^note\s+\d+\b", re.IGNORECASE),
    re.compile(r"^item\s*8\.?", re.IGNORECASE),
    re.compile(r"^item\s*9[a-z]?\.?", re.IGNORECASE),
    re.compile(r"^part\s*iii$", re.IGNORECASE),
    re.compile(r"^part\s*iv$", re.IGNORECASE),
    re.compile(r"^documents filed as part of this report$", re.IGNORECASE),
    re.compile(r"^exhibits( required by item 601)?", re.IGNORECASE),
    re.compile(r"^signatures$", re.IGNORECASE),
    re.compile(r"^power of attorney$", re.IGNORECASE),
]

HEADING_KEYWORDS = [
    "business",
    "overview",
    "risk",
    "strategy",
    "market",
    "segment",
    "customer",
    "products",
    "services",
    "competition",
    "management",
    "financial condition",
    "results of operations",
    "liquidity",
    "capital resources",
    "cybersecurity",
    "human capital",
]

COVER_NOISE_SNIPPETS = [
    "united states",
    "securities and exchange commission",
    "washington, d.c.",
    "mark one",
    "commission file number",
    "securities registered pursuant to section",
    "documents incorporated by reference",
    "indicate by check mark",
    "registrant",
    "form 10-k",
    "annual report pursuant to section",
    "transition report pursuant to section",
]


RE_WHITESPACE = re.compile(r"\s+")
RE_URL = re.compile(r"https?://\S+", re.IGNORECASE)
RE_XBRL_TAG = re.compile(r"^[a-z][a-z0-9\-]*:[A-Za-z0-9][A-Za-z0-9\-]*(?:\s+[a-z][a-z0-9\-]*:[A-Za-z0-9][A-Za-z0-9\-]*)*$")
RE_ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
RE_NUMERIC_ONLY = re.compile(r"^[\s\d.,$%()\-]+$")
RE_SEC_PAGE = re.compile(r"\|\s*\d+\s*$")
RE_MULTIPLE_UNDERSCORES = re.compile(r"_{4,}")


def normalize_line(line: str) -> str:
    return RE_WHITESPACE.sub(" ", line.strip())


def is_cover_noise(line: str) -> bool:
    lower = line.lower()
    return any(snippet in lower for snippet in COVER_NOISE_SNIPPETS)


def is_heading(line: str) -> bool:
    lower = line.lower()
    words = line.split()

    if len(words) > 14:
        return False

    if any(k in lower for k in HEADING_KEYWORDS):
        return True

    if line.isupper() and 1 <= len(words) <= 10:
        return True

    return False


def is_low_signal(line: str) -> bool:
    words = line.split()
    alpha_chars = sum(c.isalpha() for c in line)
    digit_chars = sum(c.isdigit() for c in line)
    non_space_chars = max(1, len(line.replace(" ", "")))
    digit_ratio = digit_chars / non_space_chars

    if len(words) < 7 and not is_heading(line):
        return True

    if RE_ISO_DATE.match(line):
        return True

    if RE_NUMERIC_ONLY.match(line):
        return True

    if RE_URL.search(line):
        return True

    if RE_XBRL_TAG.match(line):
        return True

    if RE_MULTIPLE_UNDERSCORES.search(line):
        return True

    if RE_SEC_PAGE.search(line.lower()):
        return True

    if line.startswith("http://") or line.startswith("https://"):
        return True

    if alpha_chars < 12 and not is_heading(line):
        return True

    if digit_ratio > 0.45 and "note " not in line.lower() and "202" not in line:
        return True

    # Keep full sentences and informative headings; drop short fragments.
    if not is_heading(line):
        if len(words) < 10 and not re.search(r"[.;:]$", line):
            return True

    return False


def find_content_window(lines: list[str]) -> tuple[int, int]:
    start = 0
    end = len(lines)

    for i, line in enumerate(lines):
        if i > 20 and any(p.search(line) for p in START_HEADING_PATTERNS):
            start = i
            break

    if start == 0:
        for i, line in enumerate(lines):
            if i < 20:
                continue
            if is_cover_noise(line):
                continue
            if len(line.split()) < 6:
                continue
            start = i
            break

    for i, line in enumerate(lines[start:], start=start):
        if i > start + 80 and any(p.search(line) for p in END_HEADING_PATTERNS):
            end = i
            break

    return start, end


def clean_short_text(text: str) -> str:
    raw_lines = [normalize_line(l) for l in text.splitlines()]
    lines = [l for l in raw_lines if l]

    start, end = find_content_window(lines)
    candidate = lines[start:end]

    seen: set[str] = set()
    kept: list[str] = []

    for line in candidate:
        if is_cover_noise(line):
            continue

        if is_low_signal(line):
            continue

        key = line.lower()
        if key in seen:
            continue
        seen.add(key)
        kept.append(line)

    return "\n".join(kept).strip() + "\n"


def output_path_for(raw_path: Path) -> Path:
    if "_raw" not in raw_path.name:
        return raw_path.with_name(raw_path.stem + "_short.txt")
    return raw_path.with_name(raw_path.name.replace("_raw", "_short", 1))


def process_file(path: Path) -> tuple[int, int, Path]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    raw_words = len(text.split())
    cleaned = clean_short_text(text)
    out = output_path_for(path)
    out.write_text(cleaned, encoding="utf-8")
    short_words = len(cleaned.split())
    return raw_words, short_words, out


def iter_raw_files(root: Path):
    for p in root.rglob("*_raw*.txt"):
        yield p


def main() -> None:
    ap = argparse.ArgumentParser(description="Create compact 10-K text files from *_raw*.txt files.")
    ap.add_argument("--root", default=str(ROOT), help="Root directory containing SEC folders")
    ap.add_argument("--file", help="Single raw file to process")
    args = ap.parse_args()

    if args.file:
        files = [Path(args.file)]
    else:
        files = list(iter_raw_files(Path(args.root)))

    if not files:
        print("No *_raw*.txt files found.")
        return

    for f in files:
        if not f.exists():
            print(f"[SKIP] {f} (not found)")
            continue
        raw_words, short_words, out = process_file(f)
        ratio = (short_words / raw_words * 100) if raw_words else 0.0
        print(f"[OK] {f} -> {out} | raw={raw_words} short={short_words} ratio={ratio:.1f}%")


if __name__ == "__main__":
    main()
