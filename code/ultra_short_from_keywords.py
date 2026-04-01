from __future__ import annotations

import argparse
import csv
import re
import unicodedata
from pathlib import Path


ROOT = Path("data/sec_10k")
DEFAULT_KEYWORDS = Path("keyword_database.csv")


def normalize_header(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def load_keywords(csv_path: Path) -> list[str]:
    if not csv_path.exists():
        raise FileNotFoundError(f"Fichier keywords introuvable: {csv_path}")

    raw = csv_path.read_text(encoding="utf-8-sig", errors="ignore")
    if not raw.strip():
        raise ValueError(f"Le fichier {csv_path} est vide.")

    sample = raw[:4096]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;|\t")
    except csv.Error:
        dialect = csv.excel

    reader = csv.reader(raw.splitlines(), dialect)
    rows = [row for row in reader if any(cell.strip() for cell in row)]
    if not rows:
        raise ValueError(f"Aucune ligne exploitable dans {csv_path}.")

    headers = [normalize_header(h) for h in rows[0]]
    keyword_columns = {
        "keyword",
        "keywords",
        "mot_cle",
        "mot_cles",
        "motcle",
        "motcles",
        "term",
        "terms",
    }
    keyword_col_indices = [i for i, h in enumerate(headers) if h in keyword_columns]

    values: list[str] = []
    if keyword_col_indices:
        data_rows = rows[1:]
        for row in data_rows:
            for i in keyword_col_indices:
                if i < len(row):
                    values.append(row[i])
    else:
        skip_first = any(
            h in {"categorie", "category", "keyword", "keywords", "mot_cle", "mot_cles"}
            for h in headers
        )
        data_rows = rows[1:] if skip_first else rows
        for row in data_rows:
            values.extend(row)

    exploded: list[str] = []
    for value in values:
        for part in re.split(r"[;|]", value):
            cleaned = part.strip().strip('"').strip("'")
            if cleaned:
                exploded.append(cleaned)

    deduped: list[str] = []
    seen: set[str] = set()
    for kw in exploded:
        key = kw.lower()
        if key not in seen:
            seen.add(key)
            deduped.append(kw)

    if not deduped:
        raise ValueError(f"Aucun keyword trouvé dans {csv_path}.")

    return deduped


def split_into_phrases(text: str) -> list[str]:
    phrases: list[str] = []
    for line in text.splitlines():
        line = re.sub(r"\s+", " ", line.strip())
        if not line:
            continue
        chunks = re.split(r"(?<=[\.\!\?;:])\s+", line)
        for chunk in chunks:
            c = chunk.strip()
            if c:
                phrases.append(c)
    return phrases


def compile_keyword_patterns(keywords: list[str]) -> list[re.Pattern[str]]:
    patterns = []
    for kw in keywords:
        escaped = re.escape(kw)
        patterns.append(re.compile(rf"(?<![A-Za-z0-9]){escaped}(?![A-Za-z0-9])", re.IGNORECASE))
    return patterns


def find_year_dir(root: Path, ticker: str, year: str | None) -> Path:
    ticker_dir = root / ticker.upper()
    if not ticker_dir.exists():
        raise FileNotFoundError(f"Dossier ticker introuvable: {ticker_dir}")

    if year:
        year_dir = ticker_dir / year
        if not year_dir.exists():
            raise FileNotFoundError(f"Dossier année introuvable: {year_dir}")
        return year_dir

    year_dirs = [p for p in ticker_dir.iterdir() if p.is_dir() and p.name.isdigit()]
    if not year_dirs:
        raise FileNotFoundError(f"Aucun dossier année trouvé dans {ticker_dir}")
    return max(year_dirs, key=lambda p: int(p.name))


def find_source_text_file(year_dir: Path, ticker: str) -> Path:
    prefix = f"{ticker.lower()}-{year_dir.name}"
    preferred = [
        year_dir / f"{prefix}_short_noxbrl.txt",
        year_dir / f"{prefix}_short.txt",
        year_dir / f"{prefix}_raw_noxbrl.txt",
        year_dir / f"{prefix}_raw.txt",
    ]
    for candidate in preferred:
        if candidate.exists():
            return candidate

    fallback_patterns = ["*_short_noxbrl.txt", "*_short.txt", "*_raw_noxbrl.txt", "*_raw.txt"]
    for pattern in fallback_patterns:
        matches = sorted(year_dir.glob(pattern))
        if matches:
            return matches[0]

    raise FileNotFoundError(f"Aucun fichier texte 10-K trouvé dans {year_dir}")


def build_ultra_short(text: str, keywords: list[str]) -> tuple[list[str], int]:
    phrases = split_into_phrases(text)
    patterns = compile_keyword_patterns(keywords)

    result: list[str] = []
    seen: set[str] = set()
    for phrase in phrases:
        if any(p.search(phrase) for p in patterns):
            key = phrase.lower()
            if key not in seen:
                seen.add(key)
                result.append(phrase)

    return result, len(phrases)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Crée ultra_short.txt avec uniquement les phrases contenant les keywords."
    )
    parser.add_argument("--ticker", default="A", help="Ticker cible, ex: A")
    parser.add_argument("--year", default=None, help="Année cible, ex: 2025. Défaut: la plus récente")
    parser.add_argument("--root", default=str(ROOT), help="Racine des fichiers SEC")
    parser.add_argument("--keywords", default=str(DEFAULT_KEYWORDS), help="CSV de keywords")
    parser.add_argument(
        "--output",
        default=None,
        help="Chemin de sortie (défaut: <ticker>/<year>/ultra_short.txt)",
    )
    parser.add_argument(
        "--source",
        default=None,
        help="Fichier source texte à filtrer (défaut: auto-détection short_noxbrl > short > raw_noxbrl > raw)",
    )
    args = parser.parse_args()

    keywords = load_keywords(Path(args.keywords))
    year_dir = find_year_dir(Path(args.root), args.ticker, args.year)

    source_file = Path(args.source) if args.source else find_source_text_file(year_dir, args.ticker)
    if not source_file.exists():
        raise FileNotFoundError(f"Fichier source introuvable: {source_file}")

    text = source_file.read_text(encoding="utf-8", errors="ignore")
    matched_phrases, total_phrases = build_ultra_short(text, keywords)

    out_path = Path(args.output) if args.output else (year_dir / "ultra_short.txt")
    out_path.write_text("\n".join(matched_phrases) + ("\n" if matched_phrases else ""), encoding="utf-8")

    print(f"[OK] source={source_file}")
    print(f"[OK] output={out_path}")
    print(f"[INFO] keywords={len(keywords)}")
    print(f"[INFO] phrases_source={total_phrases}")
    print(f"[INFO] phrases_match={len(matched_phrases)}")


if __name__ == "__main__":
    main()
